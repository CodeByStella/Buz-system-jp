"use client";

import { useState, useEffect } from "react";
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
  const [editing, setEditing] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage] = useState(10);

  // Create user form state
  const [createForm, setCreateForm] = useState<CreateUserRequest>({
    email: "",
    password: "",
    name: "",
    description: "",
    subscriptionStartAt: "",
    subscriptionEndAt: "",
  });

  // Edit user form state
  const [editForm, setEditForm] = useState<Partial<User>>({});

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
      setUsers(data.users);
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

  const handleCreateUser = async () => {
    try {
      if (!createForm.email || !createForm.password) {
        alert("メールアドレスとパスワードは必須です");
        return;
      }

      const newUser = await adminService.createUser(createForm);
      setUsers([newUser, ...users]);
      setShowCreateForm(false);
      setCreateForm({ email: "", password: "", name: "", description: "", subscriptionStartAt: "", subscriptionEndAt: "" });
    } catch (error) {
      console.error("Failed to create user:", error);
      alert("ユーザーの作成に失敗しました");
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
      alert("ユーザーの更新に失敗しました");
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      await adminService.deleteUser(userId);
      setUsers(users.filter((u) => u.id !== userId));
      setConfirmAction(null);
    } catch (error) {
      console.error("Failed to delete user:", error);
      alert("ユーザーの削除に失敗しました");
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
      alert("ユーザー状態の更新に失敗しました");
    }
  };

  const startEdit = (user: User) => {
    setEditing(user.id);
    setEditForm({
      name: user.name || "",
      description: user.description || "",
      subscriptionStartAt: user.subscriptionStartAt || "",
      subscriptionEndAt: user.subscriptionEndAt || "",
    });
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
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>ユーザー管理</CardTitle>
              <CardDescription>
                システムユーザーの管理を行います
              </CardDescription>
            </div>
            <Button
              onClick={() => setShowCreateForm(true)}
              className="flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>新規ユーザー</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {showCreateForm && (
            <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
              <h3 className="text-lg font-semibold mb-4">新規ユーザー作成</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    メールアドレス *
                  </label>
                  <CustomInput
                    type="email"
                    value={createForm.email}
                    onChange={(e) =>
                      setCreateForm({ ...createForm, email: e.target.value })
                    }
                    placeholder="user@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    パスワード *
                  </label>
                  <div className="flex space-x-2">
                    <CustomInput
                      type="password"
                      value={createForm.password}
                      onChange={(e) =>
                        setCreateForm({
                          ...createForm,
                          password: e.target.value,
                        })
                      }
                      placeholder="パスワード"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() =>
                        setCreateForm({
                          ...createForm,
                          password: generatePassword(),
                        })
                      }
                    >
                      生成
                    </Button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    名前（任意）
                  </label>
                  <CustomInput
                    value={createForm.name}
                    onChange={(e) =>
                      setCreateForm({ ...createForm, name: e.target.value })
                    }
                    placeholder="山田 太郎"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    説明（任意）
                  </label>
                  <CustomInput
                    value={createForm.description}
                    onChange={(e) =>
                      setCreateForm({
                        ...createForm,
                        description: e.target.value,
                      })
                    }
                    placeholder="ユーザーの説明"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    開始日（任意）
                  </label>
                  <CustomInput
                    type="date"
                    value={createForm.subscriptionStartAt || ""}
                    onChange={(e) =>
                      setCreateForm({ ...createForm, subscriptionStartAt: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    終了日（任意）
                  </label>
                  <CustomInput
                    type="date"
                    value={createForm.subscriptionEndAt || ""}
                    onChange={(e) =>
                      setCreateForm({ ...createForm, subscriptionEndAt: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="flex space-x-2 mt-4">
                <Button onClick={handleCreateUser}>作成</Button>
                <Button
                  variant="outline"
                  onClick={() => setShowCreateForm(false)}
                >
                  キャンセル
                </Button>
              </div>
            </div>
          )}

          <Table>
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
                    {editing === user.id ? (
                      <CustomInput
                        value={editForm.name || ""}
                        onChange={(e) =>
                          setEditForm({ ...editForm, name: e.target.value })
                        }
                        placeholder="名前"
                      />
                    ) : (
                      user.name || "-"
                    )}
                  </TableCell>
                  <TableCell>
                    {editing === user.id ? (
                      <CustomInput
                        value={editForm.description || ""}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            description: e.target.value,
                          })
                        }
                        placeholder="説明"
                      />
                    ) : (
                      user.description || "-"
                    )}
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
                      return (
                        <div className="flex items-center space-x-2">
                          <Badge
                            variant={
                              user.status === "ACTIVE" ? "default" : "destructive"
                            }
                          >
                            {user.status === "ACTIVE" ? "アクティブ" : "停止中"}
                          </Badge>
                          {expired && (
                            <span className="px-2 py-0.5 text-xs bg-yellow-100 text-yellow-800 border border-yellow-200">
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
                    {editing === user.id ? (
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          onClick={() => handleUpdateUser(user.id)}
                        >
                          保存
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={cancelEdit}
                        >
                          キャンセル
                        </Button>
                      </div>
                    ) : (
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
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

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
      {confirmAction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
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
      )}
    </div>
  );
}
