import React, { useState, useEffect } from "react";
import { Button, Grid, Paper, Typography } from "@material-ui/core";
import "../styles.css";
import { AppHeader } from "./AppHeader";
import { constructHeader, updateAppSettings } from "../util";
import { useHistory } from "react-router-dom";
const url = process.env.REACT_APP_API_URL;

export const Orders = () => {
  const [orders, setOrders] = useState([]);
  const history = useHistory();

  const redirect = () => {
    localStorage.clear();
    history.push("/login");
  };

  useEffect(() => {
    fetch(url+'/orders', { headers: constructHeader() })
      .then((res) => (res.status === 401 ? redirect() : res.json()))
      .then((json) => {
        if (json) {
          setOrders([...json.data]);
        }
      })
      .catch((err) => console.log("Error fetching orders ", err.message));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="Content">
      <AppHeader tabValue={0} />
      <Grid container justify="center" alignItems="center" direction="column">
        <Grid item style={{ marginBottom: "5vh" }}>
          <Typography variant="h3" gutterBottom>
            Orders!
            <span role="img" aria-label="orders">
              📚
            </span>
          </Typography>
        </Grid>
        <Grid item container justify="center">
          {orders.map((order, key) => {
            console.log(order)
            return (
              <Order
                key={key}
                item={order}
                title={order.title}
                //onClick={() => console.log("My Favorite")}
              />
            );
          })}
        </Grid>
      </Grid>
    </div>
  );
};

const Order = ({item}) => {
  const { description, products, status, owner, total, title } = item;
  return (
    <Paper elevation={2} className="Book">
      <Grid container direction="row">
        <Grid item xs={12}>
          <Typography variant="h6">{description}</Typography>
        </Grid>
        <Typography variant="subtitle1" gutterBottom>
          {owner}
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          {title}
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          {status}
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          {total}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          size="small"
          //onClick={() => onClick(id)}
        >
          ADD TO FAVORITES
        </Button>
      </Grid>
    </Paper>
  );
};
