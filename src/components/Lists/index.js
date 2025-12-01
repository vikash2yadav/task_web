import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import ListItemSecondaryAction from "@mui/material/ListItemSecondaryAction";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Box, Tooltip, Typography as MuiTypography } from "@mui/material";
import { CommonContext } from "../../context/CommonContext";

export default function Lists({ data, handleEditOpen, handleDelete }) {
  const { type } = React.useContext(CommonContext);

  return (
    <List sx={{ width: "100%", bgcolor: "background.paper" }}>
      {data && data.length > 0 ? (
        data.map((item) => (
          <React.Fragment key={item.id}>
            <ListItem alignItems="flex-start" sx={{ padding: "16px" }}>
              <ListItemText
                primary={
                  <Typography
                    variant="body1"
                    sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }}
                  >
                    {item?.title}
                  </Typography>
                }
                secondary={
                  <React.Fragment>
                    <Typography
                      variant="body2"
                      sx={{ fontSize: { xs: "0.8rem", sm: "1rem" } }}
                    >
                      {item?.description}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: { xs: "0.8rem", sm: "1rem" },
                        color: type === "expenses" ? "red" : "green",
                        marginTop: "0.5rem",
                      }}
                    >
                      Amount: ₹{item?.amount}
                    </Typography>
                  </React.Fragment>
                }
              />
              <ListItemSecondaryAction
                sx={{ display: { xs: "none", sm: "block" } }}
              >
                <Tooltip title="Edit">
                  <IconButton
                    edge="end"
                    aria-label="edit"
                    onClick={() => handleEditOpen(item._id)}
                    sx={{ padding: "10px" }}
                  >
                    <EditIcon />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Delete">
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => handleDelete(item._id)}
                    sx={{ padding: "10px", marginLeft: { xs: 0, sm: 1 } }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </ListItemSecondaryAction>
              <Box
                sx={{ display: { xs: "block", sm: "none" }, padding: "8px" }}
              >
                <Tooltip title="Edit">
                  <IconButton
                    aria-label="edit"
                    onClick={() => handleEditOpen(item.id)}
                    sx={{ padding: "10px", marginRight: 1 }}
                  >
                    <EditIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                  <IconButton
                    aria-label="delete"
                    onClick={() => handleDelete(item.id)}
                    sx={{ padding: "10px" }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </ListItem>
            <Divider variant="inset" component="li" />
          </React.Fragment>
        ))
      ) : (
        <ListItem>
          <ListItemText
            primary={
              <MuiTypography variant="h4" sx={{ marginTop: "6rem", textAlign: "center", width: "100%" }}>
                No Data 
              </MuiTypography>
            }
          />
        </ListItem>
      )}
    </List>
  );
}
