import {
  Box,
  Button,
  Container,
  Stack,
  TextField,
  Typography,
  Card,
  CardContent,
  Grid,
  Avatar,
  IconButton,
  useTheme,
  useMediaQuery,
  Fab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
} from "@mui/material";
import {
  AdminPanelSettings as AdminPanelSettingsIcon,
  Logout as LogoutIcon,
  CurrencyRupee as CurrencyRupeeIcon,
  Add as AddIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Savings as SavingsIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  FilterList as FilterIcon,
  DateRange as DateRangeIcon,
} from "@mui/icons-material";
import moment from "moment";
import Lists from "../components/Lists";
import { useContext, useEffect, useState } from "react";
import { CommonContext } from "../context/CommonContext";
import { IncomeContext } from "../context/IncomeContext";
import { ExpenseContext } from "../context/ExpenseContext";
import { SavingContext } from "../context/SavingContext";
import Loader from "../components/Loader";
import { useFormik } from "formik";
import { initialValue, schemaValue } from "./Schema";
import { useNavigate } from "react-router-dom";
import {
  addIncomeApi,
  getIncomeByIdApi,
  updateIncomeApi,
  deleteIncomeApi,
} from "../apis/incomes";
import { toast } from "react-hot-toast";
import {
  addExpenseApi,
  getExpenseByIdApi,
  updateExpenseApi,
  deleteExpenseApi,
  getCountApi,
} from "../apis/expenses";
import {
  addSavingApi,
  deleteSavingApi,
  getSavingByIdApi,
  updateSavingApi,
} from "../apis/savings";
import Swal from "sweetalert2";

// --- HELPER FUNCTIONS & CONSTANTS (Moved Outside) ---

const getTypeColor = (itemType) => {
  const colors = {
    incomes: "#00c853",
    expenses: "#ff3d00",
    savings: "#2979ff",
  };
  return colors[itemType] || colors.incomes;
};

const getTypeTitle = (itemType) => {
  const titles = {
    incomes: "Incomes",
    expenses: "Expenses",
    savings: "Savings",
  };
  return titles[itemType] || titles.incomes;
};

const quickDateFilters = [
  { label: "Today", start: moment(), end: moment() },
  {
    label: "This Week",
    start: moment().startOf("week"),
    end: moment().endOf("week"),
  },
  {
    label: "This Month",
    start: moment().startOf("month"),
    end: moment().endOf("month"),
  },
  {
    label: "Last Month",
    start: moment().subtract(1, "month").startOf("month"),
    end: moment().subtract(1, "month").endOf("month"),
  },
];

// --- SUB-COMPONENTS (Moved Outside to fix Focus Issue) ---

const Header = ({ userData, handleLogOut }) => (
  <Card
    sx={{
      mb: 3,
      borderRadius: 3,
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      color: "white",
      boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
    }}
  >
    <CardContent sx={{ p: 3 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Stack direction="row" alignItems="center" spacing={2}>
          <Avatar
            sx={{
              width: 56,
              height: 56,
              bgcolor: "rgba(255,255,255,0.2)",
            }}
          >
            <AdminPanelSettingsIcon sx={{ fontSize: 28 }} />
          </Avatar>
          <Box>
            <Typography variant="h5" fontWeight="700">
              Dashboard
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              {moment().format("ddd, MMM Do YYYY")}
            </Typography>
          </Box>
        </Stack>
        <IconButton
          onClick={handleLogOut}
          sx={{
            color: "white",
            bgcolor: "rgba(255,255,255,0.2)",
            "&:hover": { bgcolor: "rgba(255,255,255,0.3)" },
          }}
        >
          <LogoutIcon />
        </IconButton>
      </Stack>
    </CardContent>
  </Card>
);

const StatsWidgets = ({ countData, setType, type }) => (
  <Grid container spacing={3} sx={{ mb: 4 }}>
    {[
      {
        type: "incomes",
        title: "Incomes",
        value: countData?.income,
        icon: <TrendingUpIcon />,
      },
      {
        type: "expenses",
        title: "Expenses",
        value: countData?.expense,
        icon: <TrendingDownIcon />,
      },
      {
        type: "savings",
        title: "Savings",
        value: countData?.saving,
        icon: <SavingsIcon />,
      },
    ].map((widget) => (
      <Grid item xs={12} sm={4} key={widget.type}>
        <Card
          onClick={() => setType(widget.type)}
          sx={{
            p: 3,
            borderRadius: 3,
            cursor: "pointer",
            transition: "all 0.3s ease",
            border: `2px solid ${type === widget.type ? getTypeColor(widget.type) : "transparent"
              }`,
            background:
              type === widget.type ? `${getTypeColor(widget.type)}08` : "white",
            "&:hover": {
              transform: "translateY(-4px)",
              boxShadow: "0 12px 40px rgba(0,0,0,0.15)",
            },
          }}
        >
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar
              sx={{
                bgcolor: `${getTypeColor(widget.type)}15`,
                color: getTypeColor(widget.type),
                width: 60,
                height: 60,
              }}
            >
              {widget.icon}
            </Avatar>
            <Box sx={{ flexGrow: 1 }}>
              <Typography color="text.secondary" fontWeight="500">
                {widget.title}
              </Typography>
              <Typography
                variant="h4"
                fontWeight="700"
                sx={{ color: getTypeColor(widget.type) }}
              >
                {widget.value || 0}
              </Typography>
            </Box>
          </Stack>
        </Card>
      </Grid>
    ))}
  </Grid>
);

const DateFilterSection = ({
  dateFilter,
  handleDateFilterChange,
  applyQuickFilter,
}) => (
  <Card sx={{ mb: 3, borderRadius: 2, boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
    <CardContent sx={{ p: 2 }}>
      <Stack spacing={2}>
        {/* Quick Date Filters */}
        <Box>
          <Typography
            variant="body2"
            fontWeight="600"
            color="text.secondary"
            mb={1}
          >
            Filters
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
            {quickDateFilters.map((filter, index) => (
              <Chip
                key={index}
                label={filter.label}
                size="small"
                onClick={() => applyQuickFilter(filter.start, filter.end)}
                variant={
                  dateFilter.startDate === filter.start.format("YYYY-MM-DD")
                    ? "filled"
                    : "outlined"
                }
                color="primary"
                sx={{ cursor: "pointer" }}
              />
            ))}
          </Stack>
        </Box>

        {/* Custom Date Range */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          alignItems="center"
        >
          <Box sx={{ flex: 1 }}>
            <TextField
              fullWidth
              label="Start Date"
              type="date"
              value={dateFilter.startDate}
              onChange={(e) =>
                handleDateFilterChange("startDate", e.target.value)
              }
              InputLabelProps={{ shrink: true }}
              size="small"
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <TextField
              fullWidth
              label="End Date"
              type="date"
              value={dateFilter.endDate}
              onChange={(e) =>
                handleDateFilterChange("endDate", e.target.value)
              }
              InputLabelProps={{ shrink: true }}
              size="small"
            />
          </Box>
          <Chip
            icon={<DateRangeIcon />}
            label={`${moment(dateFilter.startDate).format("MMM DD")} - ${moment(
              dateFilter.endDate
            ).format("MMM DD, YYYY")}`}
            color="primary"
            variant="outlined"
          />
        </Stack>
      </Stack>
    </CardContent>
  </Card>
);

const FormSection = ({ type, isFormEdit, formik, setOpen, setIsFormEdit }) => (
  <Card
    sx={{ borderRadius: 3, boxShadow: "0 8px 32px rgba(0,0,0,0.1)", mb: 4 }}
  >
    <CardContent sx={{ p: 4 }}>
      <Typography
        variant="h4"
        fontWeight="700"
        gutterBottom
        sx={{
          background: `linear-gradient(135deg, ${getTypeColor(
            type
          )} 0%, ${getTypeColor(type)}99 100%)`,
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          color: "transparent",
        }}
      >
        {type === "incomes"
          ? isFormEdit
            ? "Update Income"
            : "Add Income"
          : type === "savings"
            ? isFormEdit
              ? "Update Saving"
              : "Add Saving"
            : type === "expenses"
              ? isFormEdit
                ? "Update Expense"
                : "Add Expense"
              : "Add"}
      </Typography>

      <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 3 }}>
        <Stack spacing={3}>
          <TextField
            fullWidth
            label="Title"
            variant="outlined"
            name="title"
            value={formik.values.title}
            onChange={formik.handleChange} // FIXED: Used standard Formik handler
            onBlur={formik.handleBlur}
            error={formik.touched.title && Boolean(formik.errors.title)}
            helperText={formik.touched.title && formik.errors.title}
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
          />

          <TextField
            fullWidth
            label="Description"
            variant="outlined"
            name="description"
            multiline
            rows={3}
            value={formik.values.description}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.description && Boolean(formik.errors.description)
            }
            helperText={formik.touched.description && formik.errors.description}
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
          />

          <TextField
            fullWidth
            label="Amount"
            variant="outlined"
            name="amount"
            type="number"
            InputProps={{
              startAdornment: (
                <CurrencyRupeeIcon sx={{ mr: 1, color: "text.secondary" }} />
              ),
            }}
            value={formik.values.amount}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.amount && Boolean(formik.errors.amount)}
            helperText={formik.touched.amount && formik.errors.amount}
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
          />

          <TextField
            fullWidth
            label="Date"
            type="date"
            name="date"
            value={formik.values.date}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.date && Boolean(formik.errors.date)}
            helperText={formik.touched.date && formik.errors.date}
            InputLabelProps={{ shrink: true }}
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
          />

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            justifyContent="flex-end"
            sx={{ mt: 4 }}
          >
            <Button
              variant="outlined"
              type="button"
              onClick={() => {
                setOpen(false);
                setIsFormEdit(false);
                formik.resetForm();
              }}
              sx={{
                minWidth: "120px",
                borderRadius: "12px",
                padding: "12px 24px",
                fontWeight: "600",
              }}
            >
              Cancel
            </Button>

            <Button
              variant="contained"
              type="submit"
              sx={{
                minWidth: "120px",
                borderRadius: "12px",
                padding: "12px 24px",
                fontWeight: "600",
                background: `linear-gradient(135deg, ${getTypeColor(
                  type
                )} 0%, ${getTypeColor(type)}99 100%)`,
                "&:hover": {
                  background: `linear-gradient(135deg, ${getTypeColor(
                    type
                  )}99 0%, ${getTypeColor(type)} 100%)`,
                },
              }}
            >
              {isFormEdit ? "Update" : "Add"}
            </Button>
          </Stack>
        </Stack>
      </Box>
    </CardContent>
  </Card>
);

const Dashboard = () => {
  const {
    type,
    setType,
    data,
    loading,
    setLoading,
    open,
    setOpen,
    isFormEdit,
    setIsFormEdit,
  } = useContext(CommonContext);
  const { getAllIncomes } = useContext(IncomeContext);
  const { getAllSavings } = useContext(SavingContext);
  const { getAllExpenses } = useContext(ExpenseContext);
  const [userData, setUserData] = useState();
  const [countData, setCountData] = useState();
  const [filteredData, setFilteredData] = useState([]);
  const [dateFilter, setDateFilter] = useState({
    startDate: moment().startOf("month").format("YYYY-MM-DD"),
    endDate: moment().endOf("month").format("YYYY-MM-DD"),
  });

  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const updatedInitialValue = {
    ...initialValue,
    date: moment().format("YYYY-MM-DD"),
  };

const formik = useFormik({
    initialValues: updatedInitialValue,
    validationSchema: schemaValue,
    onSubmit: async (values) => {
      let response;
      
      setLoading(true); 
      
      try {
        values.user_id = userData?._id;
        if (open && !isFormEdit) {
          if (type === "incomes") {
            response = await addIncomeApi("income/add", values);
            await getAllIncomes();
            setType("incomes");
          } else if (type === "expenses") {
            response = await addExpenseApi("expense/add", values);
            await getAllExpenses();
            setType("expenses");
          } else if (type === "savings") {
            response = await addSavingApi("saving/add", values);
            await getAllSavings();
            setType("savings");
          }
        } else {
          if (type === "incomes") {
            response = await updateIncomeApi("income/update", values);
            await getAllIncomes();
            setType("incomes");
          } else if (type === "expenses") {
            response = await updateExpenseApi("expense/update", values);
            await getAllExpenses();
            setType("expenses");
          } else if (type === "savings") {
            response = await updateSavingApi("saving/update", values);
            await getAllSavings();
            setType("savings");
          }
        }

        // Refresh counts after add/update
        await getCount();

        if (response.status === 200) {
          toast.success(response?.data?.message);
          setOpen(false);
          setIsFormEdit(false);
          formik.resetForm();
        } else {
          toast.error(response?.data?.message);
        }
      } catch (error) {
        console.error(error);
        toast.error("Something went wrong");
      } finally {
        // 2. Stop Loading (Happens regardless of success/error)
        setLoading(false); 
      }
    },
  });

  const setEditFeildValues = (editData) => {
    formik.setValues(editData);
  };

  const handleEditOpen = async (id) => {
    setIsFormEdit(true);
    setOpen(true);

    let response;

    if (type === "incomes") {
      response = await getIncomeByIdApi(`income/get/${id}`);
    } else if (type === "expenses") {
      response = await getExpenseByIdApi(`expense/get/${id}`);
    } else if (type === "savings") {
      response = await getSavingByIdApi(`saving/get/${id}`);
    }

    if (response.status === 200) {
      const editedData = response?.data?.data;
      setEditFeildValues(editedData);
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Are you want to delete this?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Delete",
    });

    if (result.isConfirmed) {
      let response;

      if (type === "incomes") {
        response = await deleteIncomeApi(`income/delete/${id}`);
        await getAllIncomes();
        await getCount();
      } else if (type === "expenses") {
        response = await deleteExpenseApi(`expense/delete/${id}`);
        await getAllExpenses();
        await getCount();
      } else if (type === "savings") {
        response = await deleteSavingApi(`saving/delete/${id}`);
        await getAllSavings();
        await getCount();
      }

      if (response.status === 200) {
        toast.success(response?.data?.message);
      } else {
        toast.error("Failed to delete the item.");
      }
    }
  };

  const handleLogOut = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Are you want to logout?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Logout",
    });

    if (result.isConfirmed) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      toast.success("You have been logout successfully");
      navigate("/");
    }
  };

  const callApi = async () => {
    setLoading(true);
    try {
      if (type === "expenses") {
        await getAllExpenses();
        setType("expenses");
      } else if (type === "savings") {
        await getAllSavings();
        setType("savings");
      } else if (type === "incomes") {
        await getAllIncomes();
        await getCount();
      }
    } finally {
      setLoading(false);
    }
  };

  const getUserInfo = async () => {
    const tokenData = await JSON.parse(localStorage.getItem("user"));
    if (tokenData) {
      setUserData(tokenData);
    }
  };

  const getCount = async () => {
    const response = await getCountApi("user/dashboard/count");
    console.log("response?.data", response?.data?.data);
    if ((response.success = true)) {
      setCountData(response?.data?.data);
    }
  };

  // Filter data by date range
  const filterDataByDate = () => {
    if (!data) return [];

    return data.filter((item) => {
      const itemDate = moment(item.date || item.createdAt);
      const startDate = moment(dateFilter.startDate);
      const endDate = moment(dateFilter.endDate);

      return itemDate.isBetween(startDate, endDate, "day", "[]");
    });
  };

  // Handle date filter change
  const handleDateFilterChange = (field, value) => {
    setDateFilter((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const applyQuickFilter = (start, end) => {
    setDateFilter({
      startDate: start.format("YYYY-MM-DD"),
      endDate: end.format("YYYY-MM-DD"),
    });
  };

  // Apply date filter when data or dateFilter changes
  useEffect(() => {
    if (data) {
      const filtered = filterDataByDate();
      setFilteredData(filtered);
    }
  }, [data, dateFilter]);

  useEffect(() => {
    callApi();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, setType]);

  useEffect(() => {
    getUserInfo();
    getCount();
  }, []);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        py: 3,
      }}
    >
      <Container maxWidth="xl">
        <Header userData={userData} handleLogOut={handleLogOut} />

        <StatsWidgets countData={countData} setType={setType} type={type} />

        {open ? (
          <FormSection
            type={type}
            isFormEdit={isFormEdit}
            formik={formik}
            setOpen={setOpen}
            setIsFormEdit={setIsFormEdit}
          />
        ) : (
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
              mb: 2,
            }}
          >
            <CardContent sx={{ p: 0 }}>
              <Box
                sx={{ p: 3, borderBottom: "1px solid", borderColor: "divider" }}
              >
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  alignItems={{ xs: "stretch", sm: "center" }}
                  justifyContent="space-between"
                  spacing={2}
                >
                  <Box>
                    <Typography
                      variant="h4"
                      fontWeight="700"
                      sx={{ fontSize: { xs: "1.75rem", sm: "2rem" } }}
                    >
                      {getTypeTitle(type)}
                    </Typography>
                    <Typography
                      color="text.secondary"
                      sx={{ fontSize: { xs: "0.9rem", sm: "1rem" } }}
                    >
                      Manage your {type.toLowerCase()} records
                    </Typography>
                  </Box>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setOpen(true)}
                    sx={{
                      borderRadius: "12px",
                      padding: { xs: "10px 20px", sm: "12px 24px" },
                      fontWeight: "600",
                      fontSize: { xs: "0.875rem", sm: "1rem" },
                      background: `linear-gradient(135deg, ${getTypeColor(
                        type
                      )} 0%, ${getTypeColor(type)}99 100%)`,
                      "&:hover": {
                        background: `linear-gradient(135deg, ${getTypeColor(
                          type
                        )}99 0%, ${getTypeColor(type)} 100%)`,
                      },
                    }}
                  >
                    Add New
                  </Button>
                </Stack>
              </Box>

              <Box
                sx={{ p: 3, borderBottom: "1px solid", borderColor: "divider" }}
              >
                <DateFilterSection
                  dateFilter={dateFilter}
                  handleDateFilterChange={handleDateFilterChange}
                  applyQuickFilter={applyQuickFilter}
                />
              </Box>

              <Box sx={{ p: 3, minHeight: "250px" }}>
                {loading ? (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      height: "200px",
                    }}
                  >
                    <Loader />
                  </Box>
                ) : isMobile ? (
                  // I've kept this logic inline for simplicity, but best practice is to extract it too
                  <Stack spacing={2} sx={{ mt: 2 }}>
                    {/* Mobile List View Logic Here... */}
                    {/* You can keep Lists/MobileListView here or extract it similarly to FormSection */}
                    {filteredData && filteredData.length > 0 ? (
                      filteredData.map((item, index) => (
                        <Card
                          key={item._id || index}
                          sx={{
                            borderRadius: 2,
                            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                          }}
                        >
                          <CardContent sx={{ p: 2 }}>
                            <Stack spacing={1}>
                              <Box
                                sx={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "flex-start",
                                }}
                              >
                                <Box sx={{ flex: 1 }}>
                                  <Typography
                                    variant="h6"
                                    fontWeight="600"
                                    sx={{ fontSize: "1.1rem" }}
                                  >
                                    {item.title}
                                  </Typography>
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{ mt: 0.5 }}
                                  >
                                    {item.description}
                                  </Typography>
                                </Box>
                                <Chip
                                  label={`₹${item.amount}`}
                                  color={
                                    type === "incomes"
                                      ? "success"
                                      : type === "expenses"
                                        ? "error"
                                        : "primary"
                                  }
                                  variant="filled"
                                  sx={{ fontWeight: "600", minWidth: "80px" }}
                                />
                              </Box>

                              <Box
                                sx={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                  mt: 1,
                                }}
                              >
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                >
                                  {moment(item.date || item.createdAt).format(
                                    "MMM DD, YYYY"
                                  )}
                                </Typography>
                                <Stack direction="row" spacing={0}>
                                  <IconButton
                                    size="small"
                                    onClick={() => handleEditOpen(item._id)}
                                    sx={{
                                      color: "primary.main",
                                    }}
                                  >
                                    <EditIcon fontSize="small" />
                                  </IconButton>
                                  <IconButton
                                    size="small"
                                    onClick={() => handleDelete(item._id)}
                                    sx={{
                                      color: "error.main",
                                    }}
                                  >
                                    <DeleteIcon fontSize="small" />
                                  </IconButton>
                                </Stack>
                              </Box>
                            </Stack>
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <Card
                        sx={{ textAlign: "center", py: 6, borderRadius: 2 }}
                      >
                        <CardContent>
                          <CurrencyRupeeIcon
                            sx={{
                              fontSize: 48,
                              color: "text.secondary",
                              mb: 2,
                            }}
                          />
                          <Typography
                            variant="h6"
                            color="text.secondary"
                            gutterBottom
                          >
                            No {getTypeTitle(type).toLowerCase()} found
                          </Typography>
                        </CardContent>
                      </Card>
                    )}
                  </Stack>
                ) : (
                  <TableContainer
                    component={Paper}
                    sx={{
                      borderRadius: 2,
                      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    }}
                  >
                    <Table>
                      <TableHead>
                        <TableRow sx={{ backgroundColor: "grey.50" }}>
                          <TableCell sx={{ fontWeight: "600" }}>
                            Title
                          </TableCell>
                          <TableCell sx={{ fontWeight: "600" }}>
                            Description
                          </TableCell>
                          <TableCell sx={{ fontWeight: "600" }}>
                            Amount
                          </TableCell>
                          <TableCell sx={{ fontWeight: "600" }}>Date</TableCell>
                          <TableCell sx={{ fontWeight: "600" }}>
                            Actions
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {filteredData && filteredData.length > 0 ? (
                          filteredData.map((item, index) => (
                            <TableRow key={item._id || index}>
                              <TableCell>
                                <Typography fontWeight="500">
                                  {item.title}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  {item.description}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Chip
                                  label={`₹${item.amount}`}
                                  color={
                                    type === "incomes"
                                      ? "success"
                                      : type === "expenses"
                                        ? "error"
                                        : "primary"
                                  }
                                  variant="filled"
                                  sx={{ fontWeight: "600", minWidth: '80px' }}
                                />
                              </TableCell>
                              <TableCell>
                                <Typography variant="body2">
                                  {moment(item.createdAt).format(
                                    "MMM DD, YYYY"
                                  )}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Stack direction="row" spacing={1}>
                                  <IconButton
                                    size="small"
                                    onClick={() => handleEditOpen(item._id)}
                                    sx={{
                                      color: "primary.main",
                                      "&:hover": {
                                        bgcolor: "primary.main",
                                        color: "white",
                                      },
                                    }}
                                  >
                                    <EditIcon fontSize="small" />
                                  </IconButton>
                                  <IconButton
                                    size="small"
                                    onClick={() => handleDelete(item._id)}
                                    sx={{
                                      color: "error.main",
                                      "&:hover": {
                                        bgcolor: "error.main",
                                        color: "white",
                                      },
                                    }}
                                  >
                                    <DeleteIcon fontSize="small" />
                                  </IconButton>
                                </Stack>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell
                              colSpan={5}
                              sx={{ textAlign: "center", py: 6 }}
                            >
                              No records found
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </Box>
            </CardContent>
          </Card>
        )}

        {!open && isMobile && (
          <Fab
            color="primary"
            aria-label="add"
            onClick={() => setOpen(true)}
            sx={{
              position: "fixed",
              bottom: 24,
              right: 24,
              background: `linear-gradient(135deg, ${getTypeColor(
                type
              )} 0%, ${getTypeColor(type)}99 100%)`,
            }}
          >
            <AddIcon />
          </Fab>
        )}
      </Container>
    </Box>
  );
};

export default Dashboard;
