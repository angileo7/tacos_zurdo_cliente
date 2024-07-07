import React, { Component } from "react";
import "../styles.css";
import axios from "axios";
import MUIDataTable from "mui-datatables";
import { CircularProgress, Typography } from "@material-ui/core";
import { confirmAlert } from "react-confirm-alert";
import { constructHeader, isMember, updateAppSettings } from "../util";

const url = process.env.REACT_APP_API_URL;

const api = axios.create({
  baseURL: url
});

export default class Orders extends Component {
  constructor(props) {
    super(props);

    this.state = {
      page: 1,
      limit: 1,
      count: 0,
      rowsPerpage: 10,
      sortOrder: {},
      isLoading: false,
      data: [],
      editData: [],
      equipment: []
    };

    //handler
    this.handleAddBtn = this.handleAddBtn.bind(this);
  }

  componentDidMount() {
    this.setState({ isLoading: true });
/*     fetch(url, { headers: constructHeader() })
    .then((res) => (res.status === 401 ? redirect() : res.json()))
    .then((json) => {
      if (json) {
        updateAppSettings(json.token);
        setFavBooks([...json.favorites]);
      }
    }) */
    api
      .get(
        `/orders?page=${this.state.page}&limit=${this.state.rowsPerpage}`
        , { headers: constructHeader() })
      .then((res) => {
        this.setState({
          data: res.data.data,
          isLoading: false,
          page: 1,
          count: res.data.totalItems
        });
     //   console.log("data: " + res.data.products);
      })
      .catch((error) => {
        alert(error);
      });
   // this.getData();
  }

  getData = () => {
/*     api
    .get(`/equipment?pageNumber=${page}&pageSize=${this.state.rowsPerpage}`)
    .then((res) => {
      this.setState({
        data: res.data.data,
        isLoading: false,
        page: res.data.pageNumber,
        limit: res.data.totalRecords
      });
      console.log("data: " + res.data.data);
    })
    .catch((error) => {
      this.setState({
        ...this.state,
        data: this.getDateSrc()[page].data,
        isLoading: false,
        page: this.getDateSrc()[page].pageNumber,
        limit: this.getDateSrc()[page].totalRecords
      });
    });
    this.setState({
      ...this.state,
      data: this.getDateSrc()[0].data,
      isLoading: false,
      page: this.getDateSrc()[0].pageNumber,
      limit: this.getDateSrc()[0].totalRecords
    }); */
  };

  changePage = (page) => {
    this.setState({ isLoading: true });

    api
      .get(`/equipment?pageNumber=${page}&pageSize=${this.state.rowsPerpage}`)
      .then((res) => {
        this.setState({
          data: res.data.data,
          isLoading: false,
          page: res.data.pageNumber,
          limit: res.data.totalRecords
        });
        console.log("data: " + res.data.data);
      })
      .catch((error) => {
        this.setState({
          ...this.state,
          data: this.getDateSrc()[page].data,
          isLoading: false,
          page: this.getDateSrc()[page].pageNumber,
          limit: this.getDateSrc()[page].totalRecords
        });
      });
  };

  showProducts = (items) => {
    const arrayProducts = Object.groupBy(items, ({ title }) => title);
    let str = ''
    for (const i in arrayProducts) {
      debugger
      str += `${arrayProducts[i].length} ${i}, `;
    }
    return str;
  }

  sort = (page) => {
    this.setState({ isLoading: true });

    api
      .get(`/equipment?pageNumber=${page}&pageSize=${this.state.rowsPerpage}`)
      .then((res) => {
        this.setState({
          data: res.data.data,
          isLoading: false,
          page: res.data.pageNumber,
          limit: res.data.totalRecords
        });
        console.log("data: " + res.data.data);
      })
      .catch((error) => {
        alert(error);
      });
  };

  delete(dataIndex) {
    let equipment = this.state.data[dataIndex];

    confirmAlert({
      title: "",
      message: "Do you really want to do this?",
      buttons: [
        {
          label: "Yes",
          onClick: () => {
            api
              .delete("/equipment/" + equipment.id)
              .then((res) => {
                window.location.reload();
              })
              .catch((error) => {
                alert(error);
              });
          }
        },
        {
          label: "No",
          onClick: () => {}
        }
      ]
    });
  }

  handleAddBtn() {
    this.setState({ addComposeModal: true });
  }

  render() {
    const columns = [
/*       {
        name: "Delete",
        options: {
          filter: false,
          sort: false,
          empty: true,

          customBodyRenderLite: (dataIndex) => {
            return (
              <i
                className="fa fa-trash"
                aria-hidden="true"
                id="deleteIcon"
                onClick={() => {
                  this.delete(dataIndex);
                }}
              />
            );
          }
        }
      }, 
      {
        name: "Edit",
        options: {
          filter: false,
          sort: false,
          empty: true,
          customBodyRenderLite: (dataIndex) => {
            const val = dataIndex;
            return (
              <i
                className="fa fa-pencil-square-o"
                aria-hidden="true"
                id="editIcon"
                onClick={() => {
                  const data = this.state.data[val];
                  this.setState({ editData: data, editShow: true });
                }}
              />
            );
          }
        }
      },*/
      {
        name: "products",
        label: "Products",
        options: {
          filter: true,
          customBodyRenderLite: (dataIndex) => {
            return <span>{this.showProducts(this.state.data[dataIndex].products)}</span>;
          }
        }
      },
      {
        name: "description",
        label: "Description",
        options: {
          filter: true,
          customBodyRenderLite: (dataIndex) => {
            return <span>{this.state.data[dataIndex].description}</span>;
          }
        }
      },
       {
        name: "owner_name",
        label: "Owner",
        options: {
          filter: true,
          customBodyRenderLite: (dataIndex) => {
            return <span>{this.state.data[dataIndex].owner_name}</span>;
          }
        }
      },
      {
        name: "status",
        label: "State",
        options: {
          filter: true,
          customBodyRenderLite: (dataIndex) => {
            const state = this.state.data[dataIndex].status;
            if (state === "Operating") {
              return (
                <div className="operating">
                  <span>{state}</span>
                </div>
              );
            } else {
              return (
                <div className="maintenance">
                  <span>{state}</span>
                </div>
              );
            }
          }
        }
      },
      {
        name: "client",
        label: "Client",
        options: {
          filter: true,
          customBodyRenderLite: (dataIndex) => {
            return <span>{this.state.data[dataIndex].client.name}</span>;
          }
        }
      },
      {
        name: "price",
        label: "Price",
        options: {
          filter: true,
          customBodyRenderLite: (dataIndex) => {
            return <span>$ {this.state.data[dataIndex].total}</span>;
          }
        }
      },
/*       {
        name: "dateAdded",
        label: "Date Added",
        options: {
          filter: true,
          customBodyRenderLite: (dataIndex) => {
            return <span>{this.state.data[dataIndex].dateAdded}</span>;
          }
        }
      }  */
    ];

    const { data, count, isLoading, rowsPerpage } = this.state;

    const options = {
      filter: true,
      filterType: "dropdown",
      responsive: "vertical",
      download: false,
      serverSide: true,
      print: false,
      count: count,
      rowsPerpage: rowsPerpage,
      rowsPerPageOptions: [],
      selectableRowsHideCheckboxes: false,
      selectableRows: "none",
      selectableRowsHeader: false,
      onColumnSortChange: (changedColumn, direction) =>
        console.log("changedColumn: ", changedColumn, "direction: ", direction),
      onChangeRowsPerPage: (numberOfRows) =>
        console.log("numberOfRows: ", numberOfRows),
      onChangePage: (currentPage) => console.log("currentPage: ", currentPage),
      onTableChange: (action, tableState) => {
        console.log(action, tableState);

        switch (action) {
          case "changePage":
            this.changePage(tableState.page);
            break;
          case "sort":
            this.sort(tableState.page);
            break;
          default:
            console.log("action not handled.");
        }
      }
    };

    return (
      <div className="home">
        <div className="btnContainer">
          <span>New Equipment</span>
          <i
            id="addIcon"
            className="fa fa-plus-circle"
            aria-hidden="true"
            onClick={this.handleAddBtn}
          ></i>
        </div>
        <MUIDataTable
          title={
            <Typography variant="h6">
              List of Orders
              {isLoading && (
                <CircularProgress
                  size={24}
                  style={{ marginLeft: 15, position: "relative", top: 4 }}
                />
              )}
            </Typography>
          }
          data={data}
          columns={columns}
          options={options}
        />
      </div>
    );
  }
}
