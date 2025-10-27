import { useEffect, useState } from "react";
import {
  Box, Typography, TextField, Button, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, IconButton,
  InputAdornment, Dialog, DialogTitle, DialogContent, DialogActions,
  MenuItem, Select
} from "@mui/material";
import { Search, Edit, Delete } from "@mui/icons-material";
import DashboardLayout from "../components/DashboardLayout";
import api from "../api";
import { getBudgets, deleteBudget, createBudget } from "../services/budgetService";

// ======================
// Interface dữ liệu
// ======================
interface Budget {
  id: number;
  category: string;
  limitAmount: number;
  spent: number;
  month: string;
  walletId: number;
}

interface Wallet {
  id: number;
  walletName: string;
  balance: number;
  bankLinked: string;
  accountNumber: string;
}

const BudgetManagementPage = () => {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  const [openDialog, setOpenDialog] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [formData, setFormData] = useState({
    category: "",
    limitAmount: 0,
    spent: 0,
    month: "",
    walletId: 0,
  });

  // ======================
  // Fetch dữ liệu
  // ======================
  useEffect(() => {
    fetchBudgets();
    fetchWallets();
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

  const fetchWallets = async () => {
    try {
      const res = await api.get("/wallets");
      setWallets(res.data);
    } catch (err) {
      console.error("❌ Lỗi tải ví:", err);
    }
  };

  // ======================
  // Xử lý mở form
  // ======================
  const handleOpenAdd = () => {
    setEditingBudget(null);
    setFormData({ category: "", limitAmount: 0, spent: 0, month: "", walletId: 0 });
    setOpenDialog(true);
  };

  const handleOpenEdit = (budget: Budget) => {
    setEditingBudget(budget);
    setFormData({ ...budget });
    setOpenDialog(true);
  };

  // ======================
  // Lưu ngân sách
  // ======================
  const handleSave = async () => {
    try {
      if (!formData.category || !formData.limitAmount || !formData.month || !formData.walletId) {
        alert("⚠️ Vui lòng nhập đủ thông tin!");
        return;
      }

      if (editingBudget) {
        await api.put(`/budgets/${editingBudget.id}`, formData);
      } else {
        await createBudget(formData);
      }

      await Promise.all([fetchBudgets(), fetchWallets()]);
      setOpenDialog(false);
    } catch (err) {
      console.error("❌ Lỗi khi lưu ngân sách:", err);
      alert("Đã xảy ra lỗi khi lưu ngân sách!");
    }
  };

  // ======================
  // Xóa ngân sách
  // ======================
  const handleDelete = async (id: number) => {
    if (window.confirm("Bạn có chắc muốn xóa ngân sách này không?")) {
      await deleteBudget(id);
      await Promise.all([fetchBudgets(), fetchWallets()]);
    }
  };

  // ======================
  // Lọc tìm kiếm
  // ======================
  const filteredBudgets = budgets.filter((b) =>
    b.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ======================
  // Giao diện
  // ======================
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
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <TextField
            placeholder="Tìm kiếm danh mục..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: "#6B8E7F" }} />
                </InputAdornment>
              ),
            }}
            sx={{
              minWidth: { xs: "100%", sm: "300px" },
              "& .MuiOutlinedInput-root": {
                backgroundColor: "#fff",
                borderRadius: "25px",
                "& fieldset": { borderColor: "#6B8E7F" },
                "&:hover fieldset": { borderColor: "#2E5B47" },
              },
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
            + Thêm ngân sách
          </Button>
        </Box>

        {/* Bảng dữ liệu */}
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
                <TableCell sx={{ color: "#fff", fontWeight: 600 }}>Ví</TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: 600 }}>Hành động</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    ⏳ Đang tải dữ liệu...
                  </TableCell>
                </TableRow>
              ) : filteredBudgets.length > 0 ? (
                filteredBudgets.map((b) => {
                  const wallet = wallets.find((w) => w.id === b.walletId);
                  const remaining = (b.limitAmount || 0) - (b.spent || 0);
                  return (
                    <TableRow key={b.id}>
                      <TableCell>{b.category}</TableCell>
                      <TableCell>{b.limitAmount.toLocaleString()} VND</TableCell>
                      <TableCell>{b.spent.toLocaleString()} VND</TableCell>
                      <TableCell
                        sx={{
                          color: remaining < 0 ? "#d32f2f" : "#2E7D32",
                          fontWeight: 600,
                        }}
                      >
                        {remaining.toLocaleString()} VND
                      </TableCell>
                      <TableCell>{b.month}</TableCell>
                      <TableCell>
                        {wallet
                          ? `${wallet.walletName}`
                          : "N/A"}
                      </TableCell>
                      <TableCell>
                        <IconButton color="primary" onClick={() => handleOpenEdit(b)}>
                          <Edit />
                        </IconButton>
                        <IconButton color="error" onClick={() => handleDelete(b.id)}>
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    Không có dữ liệu ngân sách.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Dialog thêm/sửa */}
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="xs">
          <DialogTitle>{editingBudget ? "Chỉnh sửa ngân sách" : "Thêm ngân sách mới"}</DialogTitle>
          <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
            <TextField
              label="Danh mục"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              fullWidth
            />
            <TextField
              label="Giới hạn (VND)"
              type="number"
              value={formData.limitAmount}
              onChange={(e) => setFormData({ ...formData, limitAmount: +e.target.value })}
              fullWidth
            />
            <TextField
              label="Đã chi (VND)"
              type="number"
              value={formData.spent}
              onChange={(e) => setFormData({ ...formData, spent: +e.target.value })}
              fullWidth
            />
            <TextField
              label="Tháng (YYYY-MM)"
              value={formData.month}
              onChange={(e) => setFormData({ ...formData, month: e.target.value })}
              fullWidth
            />
            <Select
              value={formData.walletId}
              onChange={(e) => setFormData({ ...formData, walletId: +e.target.value })}
              displayEmpty
              fullWidth
            >
              <MenuItem value={0} disabled>Chọn ví...</MenuItem>
              {wallets.map((w) => (
                <MenuItem key={w.id} value={w.id}>
                  {w.walletName} — {w.balance.toLocaleString()} VND
                </MenuItem>
              ))}
            </Select>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Hủy</Button>
            <Button variant="contained" sx={{ backgroundColor: "#6B8E7F" }} onClick={handleSave}>
              Lưu
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </DashboardLayout>
  );
};

export default BudgetManagementPage;
