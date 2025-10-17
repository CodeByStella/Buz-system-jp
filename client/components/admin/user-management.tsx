"use client";

import { useState, useEffect } from "react";
import * as ReactDOM from "react-dom";
import { Button } from "@/components/ui/button";
import { CustomInput } from "@/components/ui/customInput";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { adminService } from "@/lib/services";
import { Toast } from "@/components/ui/toast";
import { Plus, Edit, Trash2, Pause, Play, Eye, EyeOff } from "lucide-react";

interface User {
  id: string;
  email: string;
  name?: string;
  description?: string;
  role: "ADMIN" | "USER";
  status: "ACTIVE" | "PAUSED";
  subscriptionStartAt?: string;
  subscriptionEndAt?: string;
  createdAt: string;
}

interface CreateUserRequest {
  email: string;
  password: string;
  name?: string;
  description?: string;
  subscriptionStartAt?: string;
  subscriptionEndAt?: string;
}

export function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showEditPassword, setShowEditPassword] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage] = useState(20);
  const [creating, setCreating] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error" | "info"; message: string } | null>(null);

  // Create user form state
  const [createForm, setCreateForm] = useState<CreateUserRequest>({
    email: "",
    password: "",
    name: "",
    description: "",
    subscriptionStartAt: "",
    subscriptionEndAt: "",
  });

  // Edit user form state (allow editing email/password too)
  type EditUserForm = Partial<User> & { email?: string; password?: string };
  const [editForm, setEditForm] = useState<EditUserForm>({});

  // Confirmation dialogs
  const [confirmAction, setConfirmAction] = useState<{
    type: "delete" | "pause" | "resume";
    userId: string;
    userName: string;
  } | null>(null);

  useEffect(() => {
    fetchUsers();
  }, [currentPage]);

  const fetchUsers = async () => {
    try {
      const data = await adminService.getUsers(currentPage, itemsPerPage);
      setUsers([...data.users, ...data.users, ...data.users, ...data.users, ...data.users, ...data.users, ...data.users, ...data.users, ...data.users, ...data.users]);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  const generatePassword = () => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let password = "";
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  const generateEmail = () => {
    const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
    let local = "user-";
    for (let i = 0; i < 8; i++) {
      local += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `${local}@example.com`;
  };

  const copyToClipboard = async (text: string) => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        return true;
      }
    } catch {}
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      return true;
    } catch {
      return false;
    }
  };

  const handleCreateUser = async () => {
    try {
      if (creating) return;
      setCreating(true);
      if (!createForm.email || !createForm.password) {
        setToast({ type: "error", message: "メールアドレスとパスワードは必須です" });
        return;
      }

      const newUser = await adminService.createUser(createForm);
      setUsers([newUser, ...users]);
      setShowCreateForm(false);
      const createdEmail = createForm.email;
      const createdPassword = createForm.password;
      setCreateForm({ email: "", password: "", name: "", description: "", subscriptionStartAt: "", subscriptionEndAt: "" });
      // Copy credentials to clipboard
      const copied = await copyToClipboard(`メール: ${createdEmail}\nパスワード: ${createdPassword}`);
      setToast({ type: "success", message: copied ? "ユーザーを作成しました（認証情報をコピーしました）" : "ユーザーを作成しました（コピーに失敗しました）" });
    } catch (error) {
      console.error("Failed to create user:", error);
      setToast({ type: "error", message: "ユーザーの作成に失敗しました" });
    } finally {
      setCreating(false);
    }
  };

  const handleUpdateUser = async (userId: string) => {
    try {
      const updatedUser = await adminService.updateUser(userId, editForm);
      setUsers(users.map((u) => (u.id === userId ? updatedUser : u)));
      setEditing(null);
      setEditForm({});
    } catch (error) {
      console.error("Failed to update user:", error);
      setToast({ type: "error", message: "ユーザーの更新に失敗しました" });
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      await adminService.deleteUser(userId);
      setUsers(users.filter((u) => u.id !== userId));
      setConfirmAction(null);
    } catch (error) {
      console.error("Failed to delete user:", error);
      setToast({ type: "error", message: "ユーザーの削除に失敗しました" });
    }
  };

  const handleToggleUserStatus = async (
    userId: string,
    currentStatus: string
  ) => {
    try {
      const newStatus = currentStatus === "ACTIVE" ? "PAUSED" : "ACTIVE";
      const updatedUser = await adminService.updateUserStatus(
        userId,
        newStatus
      );
      setUsers(users.map((u) => (u.id === userId ? updatedUser : u)));
      setConfirmAction(null);
    } catch (error) {
      console.error("Failed to update user status:", error);
      setToast({ type: "error", message: "ユーザー状態の更新に失敗しました" });
    }
  };

  const startEdit = (user: User) => {
    setEditing(user.id);
    setEditForm({
      email: user.email,
      name: user.name || "",
      description: user.description || "",
      subscriptionStartAt: user.subscriptionStartAt || "",
      subscriptionEndAt: user.subscriptionEndAt || "",
    });
    setShowEditForm(true);
  };

  const cancelEdit = () => {
    setEditing(null);
    setEditForm({});
  };

  const showConfirmation = (
    type: "delete" | "pause" | "resume",
    userId: string,
    userName: string
  ) => {
    setConfirmAction({ type, userId, userName });
  };

  const confirmActionHandler = () => {
    if (!confirmAction) return;

    switch (confirmAction.type) {
      case "delete":
        handleDeleteUser(confirmAction.userId);
        break;
      case "pause":
        handleToggleUserStatus(confirmAction.userId, "ACTIVE");
        break;
      case "resume":
        handleToggleUserStatus(confirmAction.userId, "PAUSED");
        break;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>ユーザー管理</CardTitle>
          <CardDescription>システムユーザーの管理を行います</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="h-12 bg-gray-200 animate-pulse rounded"
              ></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {toast && (
        <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />
      )}
      <Card className="h-full">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>ユーザー管理</CardTitle>
              <CardDescription>
                システムユーザーの管理を行います
              </CardDescription>
            </div>
            <Button
              leftIcon={Plus}
              onClick={() => setShowCreateForm(true)}
              className="flex items-center space-x-2"
            >
              <span>新規ユーザー</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="h-full">
          <div className="overflow-x-auto overflow-y-auto max-h-[60vh]">
            <Table className="w-[1300px] min-w-[1300px]">
            <TableHeader>
              <TableRow>
                <TableHead>メール</TableHead>
                <TableHead>名前</TableHead>
                <TableHead>説明</TableHead>
                <TableHead>役割</TableHead>
                <TableHead>状態</TableHead>
                <TableHead>開始日</TableHead>
                <TableHead>終了日</TableHead>
                <TableHead>作成日</TableHead>
                <TableHead>操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.email}</TableCell>
                  <TableCell>
                    {user.name || "-"}
                  </TableCell>
                  <TableCell>
                    {user.description || "-"}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={user.role === "ADMIN" ? "default" : "secondary"}
                    >
                      {user.role === "ADMIN" ? "管理者" : "ユーザー"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {(() => {
                      const expired = user.subscriptionEndAt ? new Date(user.subscriptionEndAt) < new Date() : false;
                      const statusClasses = user.status === "ACTIVE"
                        ? "bg-green-100 text-green-800 border border-green-200"
                        : "bg-red-100 text-red-800 border border-red-200";
                      return (
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-0.5 text-xs rounded ${statusClasses}`}>
                            {user.status === "ACTIVE" ? "アクティブ" : "停止中"}
                          </span>
                          {expired && (
                            <span className="px-2 py-0.5 text-xs bg-yellow-100 text-yellow-800 border border-yellow-200 rounded">
                              期限切れ
                            </span>
                          )}
                        </div>
                      );
                    })()}
                  </TableCell>
                  <TableCell>
                    {user.subscriptionStartAt ? new Date(user.subscriptionStartAt).toLocaleDateString("ja-JP") : '-'}
                  </TableCell>
                  <TableCell>
                    {user.subscriptionEndAt ? new Date(user.subscriptionEndAt).toLocaleDateString("ja-JP") : '-'}
                  </TableCell>
                  <TableCell>
                    {new Date(user.createdAt).toLocaleDateString("ja-JP")}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => startEdit(user)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      {user.status === "ACTIVE" ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            showConfirmation("pause", user.id, user.email)
                          }
                        >
                          <Pause className="h-4 w-4" />
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            showConfirmation("resume", user.id, user.email)
                          }
                        >
                          <Play className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() =>
                          showConfirmation("delete", user.id, user.email)
                        }
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2 mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                前へ
              </Button>
              <span className="text-sm text-gray-600">
                {currentPage} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
              >
                次へ
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      {confirmAction && typeof document !== "undefined" && ReactDOM.createPortal((
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000]">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">
              {confirmAction.type === "delete" && "ユーザーを削除しますか？"}
              {confirmAction.type === "pause" && "ユーザーを停止しますか？"}
              {confirmAction.type === "resume" && "ユーザーを再開しますか？"}
            </h3>
            <p className="text-gray-600 mb-4">
              {confirmAction.type === "delete" &&
                `「${confirmAction.userName}」を削除します。この操作は取り消せません。`}
              {confirmAction.type === "pause" &&
                `「${confirmAction.userName}」を停止します。ユーザーはログインできなくなりますが、データは保持されます。`}
              {confirmAction.type === "resume" &&
                `「${confirmAction.userName}」を再開します。ユーザーは再びログインできるようになります。`}
            </p>
            <div className="flex space-x-2">
              <Button variant="destructive" onClick={confirmActionHandler}>
                {confirmAction.type === "delete" && "削除"}
                {confirmAction.type === "pause" && "停止"}
                {confirmAction.type === "resume" && "再開"}
              </Button>
              <Button variant="outline" onClick={() => setConfirmAction(null)}>
                キャンセル
              </Button>
            </div>
          </div>
        </div>
      ), document.body)}

      {/* Create User Modal */}
      {showCreateForm && typeof document !== "undefined" && ReactDOM.createPortal((
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000]">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">新規ユーザー作成</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">メールアドレス *</label>
                <div className="flex space-x-2">
                  <div className="relative h-9 flex-1">
                    <CustomInput
                      type="email"
                      value={createForm.email}
                      onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                      placeholder="user@example.com"
                    />
                  </div>
                  <Button type="button" variant="outline" onClick={() => setCreateForm({ ...createForm, email: generateEmail() })}>
                    生成
                  </Button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">パスワード *</label>
                <div className="flex space-x-2">
                  <div className="relative h-9 flex-1">
                    <CustomInput
                      type={showPassword ? "text" : "password"}
                      className="pr-10"
                      value={createForm.password}
                      onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
                      placeholder="パスワード"
                    />
                    <button
                      type="button"
                      aria-label={showPassword ? "パスワードを隠す" : "パスワードを表示"}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  <Button type="button" variant="outline" onClick={() => setCreateForm({ ...createForm, password: generatePassword() })}>
                    生成
                  </Button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">名前（任意）</label>
                <div className="relative h-9">
                  <CustomInput
                    value={createForm.name}
                    onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                    placeholder="山田 太郎"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">説明（任意）</label>
                <div className="relative h-9">
                  <CustomInput
                    value={createForm.description}
                    onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                    placeholder="ユーザーの説明"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">開始日（任意）</label>
                <div className="relative h-9">
                  <CustomInput
                    type="date"
                    value={createForm.subscriptionStartAt || ""}
                    onChange={(e) => setCreateForm({ ...createForm, subscriptionStartAt: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">終了日（任意）</label>
                <div className="relative h-9">
                  <CustomInput
                    type="date"
                    value={createForm.subscriptionEndAt || ""}
                    onChange={(e) => setCreateForm({ ...createForm, subscriptionEndAt: e.target.value })}
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-6">
              <Button onClick={handleCreateUser} disabled={creating} className={creating ? "opacity-70" : ""}>
                {creating ? "作成中..." : "作成"}
              </Button>
              <Button variant="outline" onClick={() => setShowCreateForm(false)}>キャンセル</Button>
            </div>
          </div>
        </div>
      ), document.body)}

      {/* Edit User Modal */}
      {showEditForm && typeof document !== "undefined" && ReactDOM.createPortal((
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000]">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">ユーザー編集</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">メール</label>
                <div className="relative h-9">
                  <CustomInput
                    type="email"
                    value={(editForm as any).email || ""}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    placeholder="user@example.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">名前</label>
                <div className="relative h-9">
                  <CustomInput
                    value={editForm.name || ""}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    placeholder="名前"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">説明</label>
                <div className="relative h-9">
                  <CustomInput
                    value={editForm.description || ""}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    placeholder="説明"
                  />
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">新しいパスワード（任意）</label>
                <div className="relative h-9">
                  <CustomInput
                    type={showEditPassword ? "text" : "password"}
                    className="pr-10"
                    value={(editForm as any).password || ""}
                    onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
                    placeholder="新しいパスワードを入力"
                  />
                  <button
                    type="button"
                    aria-label={showEditPassword ? "パスワードを隠す" : "パスワードを表示"}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => setShowEditPassword((v) => !v)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showEditPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">開始日（任意）</label>
                <div className="relative h-9">
                  <CustomInput
                    type="date"
                    value={(editForm.subscriptionStartAt as string) || ""}
                    onChange={(e) => setEditForm({ ...editForm, subscriptionStartAt: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">終了日（任意）</label>
                <div className="relative h-9">
                  <CustomInput
                    type="date"
                    value={(editForm.subscriptionEndAt as string) || ""}
                    onChange={(e) => setEditForm({ ...editForm, subscriptionEndAt: e.target.value })}
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-6">
              <Button onClick={() => { if (editing) handleUpdateUser(editing); setShowEditForm(false); }}>保存</Button>
              <Button variant="outline" onClick={() => { setShowEditForm(false); cancelEdit(); }}>キャンセル</Button>
            </div>
          </div>
        </div>
      ), document.body)}
    </div>
  );
}
