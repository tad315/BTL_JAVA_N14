import { useEffect, useState } from "react";
import {
  Box, Typography, TextField, Button, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, IconButton, InputAdornment,
  Dialog, DialogTitle, DialogContent, DialogActions
} from "@mui/material";
import { Search, Edit, Delete } from "@mui/icons-material";
import DashboardLayout from "../components/DashboardLayout";
import { getBudgets, deleteBudget, createBudget } from "../services/budgetService";
import api from "../api"; // 🆕 dùng api.put khi update

// ✅ Interface dữ liệu
interface Budget {
  id: number;
  category: string;
  limitAmount: number;
  spent: number;
  month: string;
  walletId: number;
}

const BudgetManagementPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(false);

  // 🆕 State cho dialog thêm/sửa
  const [openDialog, setOpenDialog] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [formData, setFormData] = useState({
    category: "",
    limitAmount: 0,
    spent: 0,
    month: "",
    walletId: 1,
  });

  // ✅ Lấy danh sách
  useEffect(() => {
    fetchBudgets();
  }, []);

  const fetchBudgets = async () => {
    setLoading(true);
    try {
      const data = await getBudgets();
      setBudgets(data);
    } catch (err) {
      console.error("❌ Lỗi tải ngân sách:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Mở form thêm mới
  const handleOpenAdd = () => {
    setEditingBudget(null);
    setFormData({
      category: "",
      limitAmount: 0,
      spent: 0,
      month: "",
      walletId: 1,
    });
    setOpenDialog(true);
  };

  // ✅ Mở form chỉnh sửa
  const handleOpenEdit = (budget: Budget) => {
    setEditingBudget(budget);
    setFormData({
      category: budget.category,
      limitAmount: budget.limitAmount,
      spent: budget.spent,
      month: budget.month,
      walletId: budget.walletId,
    });
    setOpenDialog(true);
  };

  // ✅ Lưu dữ liệu (tự động phân biệt thêm/sửa)
  const handleSave = async () => {
    try {
      if (!formData.category || !formData.limitAmount || !formData.month) {
        alert("⚠️ Vui lòng nhập đầy đủ thông tin!");
        return;
      }

      if (editingBudget) {
        // ✏️ Update
        await api.put(`/budgets/${editingBudget.id}`, formData);
      } else {
        // ➕ Create
        await createBudget(formData);
      }

      setOpenDialog(false);
      await fetchBudgets();
    } catch (err) {
      alert("❌ Lỗi khi lưu ngân sách!");
      console.error(err);
    }
  };

  // ✅ Xóa ngân sách
  const handleDelete = async (id: number) => {
    if (!window.confirm("Bạn có chắc muốn xóa ngân sách này không?")) return;
    try {
      await deleteBudget(id);
      setBudgets((prev) => prev.filter((b) => b.id !== id));
    } catch (err) {
      console.error("❌ Lỗi khi xóa ngân sách:", err);
    }
  };

  // ✅ Lọc tìm kiếm
  const filteredBudgets = budgets.filter((b) =>
    b.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <Box>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, color: "#2E5B47" }}>
          Quản lý ngân sách:
        </Typography>

        {/* Thanh tìm kiếm + nút thêm */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
            gap: 2,
            flexWrap: "wrap",
          }}
        >
          <TextField
            placeholder="Tìm kiếm danh mục..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{
              minWidth: { xs: "100%", sm: "300px" },
              "& .MuiOutlinedInput-root": {
                backgroundColor: "#fff",
                borderRadius: "25px",
                "& fieldset": { borderColor: "#6B8E7F" },
                "&:hover fieldset": { borderColor: "#2E5B47" },
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: "#6B8E7F" }} />
                </InputAdornment>
              ),
            }}
          />

          <Button
            variant="contained"
            onClick={handleOpenAdd}
            sx={{
              backgroundColor: "#6B8E7F",
              color: "#fff",
              borderRadius: "25px",
              px: 4,
              py: 1,
              textTransform: "none",
              fontSize: "1rem",
              "&:hover": { backgroundColor: "#2E5B47" },
            }}
          >
            + Thêm danh mục
          </Button>
        </Box>

        {/* Bảng */}
        <TableContainer
          component={Paper}
          sx={{
            borderRadius: 2,
            boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(10px)",
          }}
        >
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#6B8E7F" }}>
                <TableCell sx={{ color: "#fff", fontWeight: 600 }}>Danh mục</TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: 600 }}>Ngân sách</TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: 600 }}>Đã chi</TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: 600 }}>Còn lại</TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: 600 }}>Tháng</TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: 600 }}>Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    Đang tải dữ liệu...
                  </TableCell>
                </TableRow>
              ) : filteredBudgets.length > 0 ? (
                filteredBudgets.map((b) => {
                  const remaining = (b.limitAmount || 0) - (b.spent || 0);
                  return (
                    <TableRow key={b.id}>
                      <TableCell>{b.category}</TableCell>
                      <TableCell>{b.limitAmount?.toLocaleString()} VND</TableCell>
                      <TableCell>{b.spent?.toLocaleString()} VND</TableCell>
                      <TableCell>{remaining.toLocaleString()} VND</TableCell>
                      <TableCell>{b.month}</TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", gap: 1 }}>
                          <IconButton
                            size="small"
                            sx={{ color: "#6B8E7F" }}
                            onClick={() => handleOpenEdit(b)}
                          >
                            <Edit />
                          </IconButton>
                          <IconButton
                            size="small"
                            sx={{ color: "#f44336" }}
                            onClick={() => handleDelete(b.id)}
                          >
                            <Delete />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    Không có dữ liệu ngân sách
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* 🆕 Dialog Thêm / Sửa */}
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="xs" fullWidth>
          <DialogTitle>
            {editingBudget ? "Chỉnh sửa ngân sách" : "Thêm ngân sách mới"}
          </DialogTitle>
          <DialogContent
            sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
          >
            <TextField
              label="Danh mục"
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              fullWidth
            />
            <TextField
              label="Giới hạn (VND)"
              type="number"
              value={formData.limitAmount}
              onChange={(e) =>
                setFormData({ ...formData, limitAmount: Number(e.target.value) })
              }
              fullWidth
            />
            <TextField
              label="Đã chi (VND)"
              type="number"
              value={formData.spent}
              onChange={(e) =>
                setFormData({ ...formData, spent: Number(e.target.value) })
              }
              fullWidth
            />
            <TextField
              label="Tháng (YYYY-MM)"
              value={formData.month}
              onChange={(e) =>
                setFormData({ ...formData, month: e.target.value })
              }
              placeholder="2025-10"
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Hủy</Button>
            <Button
              variant="contained"
              sx={{ backgroundColor: "#6B8E7F" }}
              onClick={handleSave}
            >
              Lưu
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </DashboardLayout>
  );
};

export default BudgetManagementPage;
