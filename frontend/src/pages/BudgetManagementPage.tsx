import { useEffect, useState } from "react";
import {
  Box, Typography, TextField, Button, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, IconButton,
  InputAdornment, Dialog, DialogTitle, DialogContent, DialogActions, MenuItem, Select
} from "@mui/material";
import { Search, Edit, Delete } from "@mui/icons-material";
import DashboardLayout from "../components/DashboardLayout";
import api from "../api";
import { getBudgets, deleteBudget, createBudget } from "../services/budgetService";

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

      // 🔄 cập nhật FE ngay
      await Promise.all([fetchBudgets(), fetchWallets()]);
      setOpenDialog(false);
    } catch (err) {
      console.error("❌ Lỗi khi lưu ngân sách:", err);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Bạn có chắc muốn xóa ngân sách này không?")) {
      await deleteBudget(id);
      await Promise.all([fetchBudgets(), fetchWallets()]);
    }
  };

  const filteredBudgets = budgets.filter((b) =>
    b.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <Box>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, color: "#2E5B47" }}>
          Quản lý ngân sách:
        </Typography>

        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
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
            sx={{ width: "40%" }}
          />

          <Button
            variant="contained"
            onClick={handleOpenAdd}
            sx={{ backgroundColor: "#6B8E7F", borderRadius: "20px" }}
          >
            + Thêm ngân sách
          </Button>
        </Box>

        <TableContainer
          component={Paper}
          sx={{
            borderRadius: 2,
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            backgroundColor: "rgba(255,255,255,0.9)",
          }}
        >
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#6B8E7F" }}>
                <TableCell sx={{ color: "white" }}>Danh mục</TableCell>
                <TableCell sx={{ color: "white" }}>Ngân sách</TableCell>
                <TableCell sx={{ color: "white" }}>Đã chi</TableCell>
                <TableCell sx={{ color: "white" }}>Còn lại</TableCell>
                <TableCell sx={{ color: "white" }}>Tháng</TableCell>
                <TableCell sx={{ color: "white" }}>Ví</TableCell>
                <TableCell sx={{ color: "white" }}>Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredBudgets.length > 0 ? (
                filteredBudgets.map((b) => {
                  const wallet = wallets.find((w) => w.id === b.walletId);
                  const remaining = (b.limitAmount || 0) - (b.spent || 0);
                  return (
                    <TableRow key={b.id}>
                      <TableCell>{b.category}</TableCell>
                      <TableCell>{b.limitAmount.toLocaleString()} VND</TableCell>
                      <TableCell>{b.spent.toLocaleString()} VND</TableCell>
                      <TableCell sx={{ color: remaining < 0 ? "#d32f2f" : "#2E7D32", fontWeight: 600, }}>
                        {remaining.toLocaleString()} VND
                      </TableCell>
                      <TableCell>{b.month}</TableCell>
                      <TableCell>
                        {wallet
                          ? `${wallet.walletName} — ${wallet.balance.toLocaleString()} VND`
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

        {/* Dialog Thêm / Sửa */}
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="xs">
          <DialogTitle>{editingBudget ? "Chỉnh sửa ngân sách" : "Thêm ngân sách mới"}</DialogTitle>
          <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
            <TextField label="Danh mục" value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })} />
            <TextField label="Giới hạn (VND)" type="number" value={formData.limitAmount}
              onChange={(e) => setFormData({ ...formData, limitAmount: +e.target.value })} />
            <TextField label="Đã chi (VND)" type="number" value={formData.spent}
              onChange={(e) => setFormData({ ...formData, spent: +e.target.value })} />
            <TextField label="Tháng (YYYY-MM)" value={formData.month}
              onChange={(e) => setFormData({ ...formData, month: e.target.value })} />
            <Select value={formData.walletId}
              onChange={(e) => setFormData({ ...formData, walletId: +e.target.value })}
              displayEmpty>
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
