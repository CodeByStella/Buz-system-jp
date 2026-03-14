"use client";

import React from "react";
import * as ReactDOM from "react-dom";
import { Save, Loader2 } from "lucide-react";
import { Button } from "../../../ui/button";
import { CustomInput } from "../../../ui/customInput";
import { ExcelExportButton } from "../../../ui/excelExportButton";
import { PDFExportButton } from "../../../ui/pdfExportButton";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../ui/table";
import { useDataContext } from "../../../../lib/contexts";
import { cn } from "../../../../lib/utils";
import {
  resultSectionsQuantitative,
  resultSectionSubjective,
  quantitativeSubtotalCell,
  quantitativeRatingCell,
  qualitativeSubtotalCell,
  totalScoreCell,
  combinedRatingCell,
  ratingTableQuantitative,
  ratingTableCombined,
} from "./cells";

const sheetName = "result";

const ERROR_PATTERNS = [
  "#NAME?",
  "#CYCLE!",
  "#ERROR!",
  "#REF!",
  "#VALUE!",
  "#DIV/0!",
  "#N/A",
  "#NUM!",
  "#NULL!",
];

function isErrorValue(value: string | number | undefined): boolean {
  if (value === undefined || value === null) return false;
  const s = String(value).trim();
  return ERROR_PATTERNS.some((err) => s.includes(err));
}

function formatResultValue(
  value: string | number | undefined,
  suffix?: string
): string {
  if (value === undefined || value === null || value === "") return "—";
  if (isErrorValue(value)) return "—";
  if (typeof value === "number" && !Number.isNaN(value)) {
    const formatted = Number.isInteger(value)
      ? String(value)
      : String(Number(value.toFixed(2)));
    return suffix ? `${formatted}${suffix}` : formatted;
  }
  return String(value);
}

function formatPointsValue(value: string | number | undefined): string {
  if (value === undefined || value === null || value === "") return "—";
  if (isErrorValue(value)) return "—";
  return String(value);
}

/** 位 column: unit only (%, 年, 倍) - no value */
function getUnitDisplay(suffix?: string): string {
  if (!suffix || !suffix.trim()) return "";
  return suffix.trim();
}

/** Yellow tooltip above cell on hover (same style as start-sheet / CustomInput tip) */
function RatingCellWithTooltip({
  display,
  tooltip,
  className,
}: {
  display: string;
  tooltip: string;
  className?: string;
}) {
  const [hover, setHover] = React.useState(false);
  const [position, setPosition] = React.useState<{ top: number; left: number } | null>(null);
  const ref = React.useRef<HTMLDivElement>(null);

  const updatePosition = React.useCallback(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setPosition({
        top: rect.top,
        left: rect.left + rect.width / 2,
      });
    }
  }, []);

  const onEnter = () => {
    if (tooltip) {
      updatePosition();
      setHover(true);
    }
  };
  const onLeave = () => setHover(false);

  React.useEffect(() => {
    if (hover && tooltip) {
      window.addEventListener("scroll", updatePosition, true);
      window.addEventListener("resize", updatePosition);
      return () => {
        window.removeEventListener("scroll", updatePosition, true);
        window.removeEventListener("resize", updatePosition);
      };
    }
  }, [hover, tooltip, updatePosition]);

  const tipElement =
    tooltip &&
    hover &&
    position &&
    typeof document !== "undefined" &&
    ReactDOM.createPortal(
      <div
        className="fixed z-[99999] w-max max-w-xs bg-yellow-200 text-gray-900 text-xs px-3 py-2 rounded shadow-xl border border-yellow-400 pointer-events-none whitespace-normal text-left"
        style={{
          top: `${position.top - 8}px`,
          left: `${position.left}px`,
          transform: "translate(-50%, -100%)",
        }}
      >
        {tooltip}
        <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-yellow-200" />
      </div>,
      document.body
    );

  return (
    <div
      ref={ref}
      className={className}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      {display}
      {tipElement}
    </div>
  );
}

export default function ResultSheet() {
  const { onSave, saving, hasChanges, loading, getCell } = useDataContext();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">結果</h1>
        <div className="flex items-center gap-2">
          <Button
            onClick={onSave}
            disabled={saving || !hasChanges}
            leftIcon={saving ? <Loader2 className="animate-spin" /> : <Save />}
          >
            {saving ? "保存中..." : "保存"}
          </Button>
          <ExcelExportButton workbook="company_rating" />
          <PDFExportButton workbook="company_rating" />
        </div>
      </div>

      {loading ? (
        <div className="h-64 bg-gray-100 animate-pulse rounded" />
      ) : (
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left: Evaluation table */}
          <div className="flex-1 min-w-0">
            <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded px-3 py-2 mb-3">
              スコア表を基にスコアを入力
            </p>
            <div className="rounded border border-gray-200 overflow-hidden bg-white">
              <Table className="table-fixed w-full">
                <colgroup>
                  <col style={{ width: "35%" }} />
                  <col style={{ width: "20%" }} />
                  <col style={{ width: "5%" }} />
                  <col style={{ width: "20%" }} />
                  <col style={{ width: "20%" }} />
                </colgroup>
                <TableHeader>
                  <TableRow className="bg-green-100">
                    <TableHead className="py-2">項目</TableHead>
                    <TableHead className="text-right py-2">結果</TableHead>
                    <TableHead className="text-center py-2 w-9">位</TableHead>
                    <TableHead className="text-center py-2">配点</TableHead>
                    <TableHead className="py-2">評価</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {resultSectionsQuantitative.map((section) => (
                    <React.Fragment key={section.title}>
                      <TableRow className="bg-sky-100 font-medium">
                        <TableCell colSpan={5} className="py-1.5 text-sm">
                          {section.title}
                        </TableCell>
                      </TableRow>
                      {section.rows.map((row) => (
                        <TableRow key={row.label} className="border-b">
                          <TableCell className="py-1.5 font-medium">
                            {row.label}
                          </TableCell>
                          <TableCell className="py-1.5 text-right tabular-nums bg-orange-200">
                            {row.resultCell === "C14" ? (
                              <div className="relative w-full h-8 min-h-[2rem]">
                                <CustomInput
                                  type="text"
                                  sheet={sheetName}
                                  cell="C14"
                                  className="border-transparent w-full py-1 px-2 text-sm min-h-[2rem] bg-orange-200 text-right"
                                />
                              </div>
                            ) : (
                              formatResultValue(
                                getCell(sheetName, row.resultCell),
                                undefined
                              )
                            )}
                          </TableCell>
                          <TableCell className="py-1.5 text-center text-muted-foreground text-sm w-9 bg-green-100">
                            {getUnitDisplay(row.resultSuffix)}
                          </TableCell>
                          <TableCell className="py-1.5 text-center bg-green-100">
                            {formatPointsValue(getCell(sheetName, row.pointsCell))}
                          </TableCell>
                          <TableCell className="p-0 align-middle bg-green-100">
                            <div className="relative min-h-[2rem] w-full">
                              <CustomInput
                                type="text"
                                sheet={sheetName}
                                cell={row.evaluationCell}
                                className="border-transparent w-full py-1 px-2 text-sm min-h-[2rem] bg-green-100"
                              />
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </React.Fragment>
                  ))}
                  <TableRow className="bg-yellow-200 font-semibold">
                    <TableCell className="py-2">定量要因小計</TableCell>
                    <TableCell className="py-2" colSpan={2} />
                    <TableCell className="text-center py-2 bg-yellow-200">
                      {formatPointsValue(getCell(sheetName, quantitativeSubtotalCell))}
                    </TableCell>
                    <TableCell className="py-2 bg-yellow-200" />
                  </TableRow>

                  <TableRow className="bg-sky-100 font-medium">
                    <TableCell colSpan={5} className="py-1.5 text-sm">
                      {resultSectionSubjective.title}
                    </TableCell>
                  </TableRow>
                  {resultSectionSubjective.rows.map((row) => (
                    <TableRow key={row.label} className="border-b">
                      <TableCell className="py-1.5 font-medium">
                        {row.label}
                      </TableCell>
                      <TableCell className="py-1.5">—</TableCell>
                      <TableCell className="py-1.5 bg-green-100" />
                      <TableCell className="p-0 align-middle bg-green-100">
                        <div className="relative min-h-[2rem] w-full max-w-[4rem] mx-auto">
                          <CustomInput
                            type="number"
                            sheet={sheetName}
                            cell={row.pointsCell}
                            className="border-transparent text-center py-1 h-8 text-sm bg-green-100"
                          />
                        </div>
                      </TableCell>
                      <TableCell className="p-0 align-middle bg-green-100">
                        <div className="relative min-h-[2rem] w-full">
                          <CustomInput
                            type="text"
                            sheet={sheetName}
                            cell={row.evaluationCell}
                            className="border-transparent w-full py-1 px-2 text-sm min-h-[2rem] bg-green-100"
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="bg-yellow-200 font-semibold">
                    <TableCell className="py-2">定性要因小計</TableCell>
                    <TableCell className="py-2" colSpan={2} />
                    <TableCell className="text-center py-2 bg-yellow-200">
                      {formatPointsValue(getCell(sheetName, qualitativeSubtotalCell))}
                    </TableCell>
                    <TableCell className="py-2 bg-yellow-200" />
                  </TableRow>
                  <TableRow className="bg-yellow-300 font-bold">
                    <TableCell className="py-2">スコア合計</TableCell>
                    <TableCell className="py-2" colSpan={2} />
                    <TableCell className="text-center py-2 bg-yellow-300">
                      {formatPointsValue(getCell(sheetName, totalScoreCell))}
                    </TableCell>
                    <TableCell className="py-2 bg-yellow-300" />
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Right: Rating tables (with tooltips for 格付け tips like リスクなし) - shared col widths */}
          <div className="lg:w-[320px] space-y-4 shrink-0">
            <div className="rounded border border-gray-200 overflow-hidden bg-white">
              <Table className="table-fixed">
                <colgroup>
                  <col style={{ width: "72%" }} />
                  <col style={{ width: "28%" }} />
                </colgroup>
                <TableHeader>
                  <TableRow className="bg-yellow-200">
                    <TableHead className="py-2">スコア</TableHead>
                    <TableHead className="py-2">格付け</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ratingTableQuantitative.map((r) => (
                    <TableRow key={r.score} className="border-b bg-white">
                      <TableCell className="py-1.5 text-sm bg-yellow-100">{r.score}</TableCell>
                      <TableCell className="py-1.5 text-sm bg-yellow-100">
                        <RatingCellWithTooltip
                          display={r.display}
                          tooltip={r.tooltip}
                          className="cursor-help"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter className="[&_tr]:bg-transparent [&_tr]:border-t">
                  <TableRow>
                    <TableCell className="py-2 pl-3 pr-2 text-sm text-muted-foreground bg-white">
                      定量要因 格付け判定:
                    </TableCell>
                    <TableCell className="py-2 px-3 text-sm font-semibold bg-yellow-200 text-center">
                      {String(getCell(sheetName, quantitativeRatingCell) ?? "—")}
                    </TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </div>

            <div className="rounded border border-gray-200 overflow-hidden bg-white">
              <Table className="table-fixed">
                <colgroup>
                  <col style={{ width: "72%" }} />
                  <col style={{ width: "28%" }} />
                </colgroup>
                <TableHeader>
                  <TableRow className="bg-yellow-200">
                    <TableHead className="py-2">スコア</TableHead>
                    <TableHead className="py-2">格付け</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ratingTableCombined.map((r) => (
                    <TableRow key={r.score} className="border-b bg-white">
                      <TableCell className="py-1.5 text-sm bg-yellow-100">{r.score}</TableCell>
                      <TableCell className="py-1.5 text-sm bg-yellow-100">
                        <RatingCellWithTooltip
                          display={r.display}
                          tooltip={r.tooltip}
                          className="cursor-help"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter className="[&_tr]:bg-transparent [&_tr]:border-t">
                  <TableRow>
                    <TableCell className="py-2 pl-3 pr-2 text-sm text-muted-foreground bg-white">
                      定量・定性要因 格付け判定:
                    </TableCell>
                    <TableCell className="py-2 px-3 text-sm font-semibold bg-yellow-200 text-center">
                      {String(getCell(sheetName, combinedRatingCell) ?? "—")}
                    </TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
