// Company-rating workbook: 4 sheets (input_data, result, score_table, safety_indicators)
// Extracted from template-company-rating.xlsx

export const sheetsDataCompanyRating: Record<string, { [cell: string]: string | number }> = {
  input_data: {
    B1: "",
    C1: "",
  },
  result: {
    B2: "=input_data!C1",

    C6: "=input_data!C4/input_data!E4*100",
    C7: "=input_data!C6/input_data!E6*100",
    C8: "=input_data!C8/input_data!E8*100",
    C9: "=input_data!C10/input_data!E10*100",
    C12: "=input_data!C12/input_data!E12*100",
    C13: "=input_data!C14/input_data!E14*100",
    C17: "=input_data!C16/input_data!E16*100",
    C22: "=input_data!C18/input_data!E18",
    C23: "=input_data!C20/input_data!E20",
    C24: "=input_data!C22",
    C25: "=MAX(0,input_data!C24/input_data!E24)",

    // HyperFormula: use TRUE() not TRUE (named expression not recognized in formula text)
    E6: "=IFS(C6>=60,10,C6>=50,9,C6>=40,8,C6>=35,7,C6>=30,6,C6>=25,5,C6>=20,3,C6>=15,1,TRUE(),0)",
    E7: "=IFS(C7<=50,10,C7<=100,8,C7<=150,6,C7<=200,4,C7<=250,2,TRUE(),0)",
    E8: "=IFS(C8<=50,7,C8<=60,5,C8<=80,3,C8<=100,1,TRUE(),0)",
    E9: "=IFS(C9>=160,7,C9>=140,5,C9>=120,3,C9>=100,1,TRUE(),0)",
    E12: "=IFS(C12<0,0,C12>=4,5,C12>=3,4,C12>=2,3,C12>=1,2,TRUE(),1)",
    E13: "=IFS(C13<0,0,C13>=3,5,C13>=1,3,TRUE(),1)",
    E14: "=IFS(C14=\"3期連続黒字\",5,C14=\"2期連続黒字\",3,TRUE(),0)",
    E17: "=IFS(C17>=30,5,C17>=20,4,C17>=15,3,C17>=10,2,C17>=5,1,TRUE(),0)",
    E18: "=IF(C18=\"\",0,IFS(C18<0,0,C18>10000000000,15,C18>7000000000,12,C18>5000000000,10,C18>3000000000,8,C18>1000000000,7,C18>700000000,6,C18>500000000,5,C18>300000000,4,C18>100000000,3,C18>50000000,2,TRUE(),1))",
    E19: "=IF(C19=\"\",0,IFS(C19>=100000000000,15,C19>=10000000000,10,C19>=5000000000,7,C19>=3000000000,5,C19>=1000000000,3,C19>=500000000,2,C19>=100000000,1,TRUE(),0))",
    E22: "=IFS(C22<0,0,C22<=1,20,C22<=3,17,C22<=5,14,C22<=7,11,C22<=9,8,C22<=12,5,C22<=15,3,C22<=20,2,TRUE(),1)",
    E23: "=IFS(C23<1,0,C23>5,15,C23>4,12,C23>3,10,C23>2.5,8,C23>2,7,C23>1.75,6,C23>1.5,4,C23>1.25,3,TRUE(),2)",
    E24: "=IFS(C24<0,0,C24>10000000000,20,C24>7000000000,18,C24>5000000000,16,C24>3000000000,14,C24>1000000000,12,C24>700000000,10,C24>500000000,8,C24>300000000,6,C24>100000000,4,TRUE(),2)",
    E26: "=SUM(E5:E25)",
    E40: "=SUM(E28:E38)",
    E42: "=E26+E40",

    J26: "=E26",
    J42: "=E42+E26", // same as E42+J26 but avoid J26 ref so HyperFormula does not report #CYCLE!

  },
  score_table: {

  },
  safety_indicators: {
  },
};