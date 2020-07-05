import React from 'react';
import { Redirect } from "react-router-dom";

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TablePagination from '@material-ui/core/TablePagination';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import Menu_HP from '../components/Menu_HP'
import Title_HP from '../components/Title_HP'


class TopLists extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            users: [],
            all_user_count: 0,
            go_device: false,
            dev_name: "",
            dev_mac: "",
            row_per_page: 10,
            page_num: 0,
            login_required: false
        };
        this.getData = this.getData.bind(this)
        this.goDevice = this.goDevice.bind(this)
        this.handleChangeRowsPerPage = this.handleChangeRowsPerPage.bind(this)
        this.handleChangePage = this.handleChangePage.bind(this)
    }

    componentDidMount() {
        this.getData()
    }

    getData() {

        // create a new XMLHttpRequest
        var xhr = new XMLHttpRequest()

        // get a callback when the server responds
        xhr.addEventListener('load', () => {
            // update the state of the component with the result here
            console.log(xhr.responseText)
            var data_obj = JSON.parse(xhr.responseText);
            if (data_obj["status"] === "success"){
                 if (data_obj.hasOwnProperty('users') && data_obj.hasOwnProperty('all_user_count')){
                    this.setState(state => ({
                        users: data_obj.users,
                        all_user_count: data_obj.all_user_count
                    }));
                 }
            }
            else{
                this.setState(state => ({
                    login_required: true
                }));
            }
        })
        var params = "?per_page=" + this.state.row_per_page + "&page_num=" + (this.state.page_num + 1)
        console.log(params)
        // open the request with the verb and the url
        xhr.open('GET', 'http://' + process.env.REACT_APP_SERVER_ADDRESS + ':' + process.env.REACT_APP_SERVER_PORT + '/top_by_hours' + params)
        // add auth token
        xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem('Token'))
        // send the request
        xhr.send()
    }

    goDevice(dev_name, dev_mac) {
        console.log("name: " + dev_name)
        console.log("mac: " + dev_mac)
        this.setState(state => ({
            go_device: true,
            dev_name: dev_name,
            dev_mac: dev_mac
        }));
    }

    handleChangePage(event, newPage) {
        this.setState(state => ({
            page_num: newPage
        })
        , () => this.getData());
    };

    handleChangeRowsPerPage(event){
        this.setState(state => ({
            row_per_page: +event.target.value,
            page_num: 0
        })
        , () => this.getData());
    };

    render() {
        if (this.state.login_required) {
            return <Redirect to={{
                pathname: "/login"
            }}/>;
        }
        if (this.state.go_device) {
            return <Redirect to={{
                pathname: "/mac_device",
                state: {
                    mac: this.state.dev_mac,
                    name: this.state.dev_name,
                }
            }}/>;
        }
        return  (
            <Grid container className='MainContainer'>
                
                {/* Title */}
                <Title_HP/>


                {/* Menu */}
                <Menu_HP current_page={1}/>

                {/* Tabble */}
                <Grid container item xs={12}>
                    <Grid item only={['md', 'lg', 'xl']} md={4}></Grid>
                    <Grid item xs={12} md={4}>
                        <TableContainer component={Paper} style={{borderRadius: '0%'}}>
                            <Table aria-label="simple table" style={{color: "var(--main-bg-color)"}}>
                                <TableHead style={{backgroundColor: "var(--main-primary-color)", color: "var(--main-bg-color) !important"}}>
                                    <TableRow>
                                        <Hidden only={['xs', 'sm']}>
                                            {/* Button PC */}
                                            <TableCell style={{fontSize: "1vw"}} align="center">#</TableCell>
                                            <TableCell style={{fontSize: "1vw"}} align="center">MAC address</TableCell>
                                            <TableCell style={{fontSize: "1vw"}} align="center">User</TableCell>
                                            <TableCell style={{fontSize: "1vw"}} align="center">Active hours</TableCell>
                                        </Hidden>
                                        <Hidden only={['md', 'lg', 'xl']}>
                                            {/* Button Mobile */}
                                            <TableCell style={{fontSize: "3vw"}} align="center">#</TableCell>
                                            <TableCell style={{fontSize: "3vw"}} align="center">MAC address</TableCell>
                                            <TableCell style={{fontSize: "3vw"}} align="center">User</TableCell>
                                            <TableCell style={{fontSize: "3vw"}} align="center">Active hours</TableCell>
                                        </Hidden>
                                    </TableRow>
                                </TableHead>
                                <TableBody style={{backgroundColor: "var(--main-primary-color)", opacity: "0.5"}}>
                                {this.state.users.map((user, index) => (
                                    <TableRow key={index} onClick={() => this.goDevice(user.name, user.mac)} style={{cursor: "pointer"}}>
                                        <Hidden only={['xs', 'sm']}>
                                            {/* Button PC */}
                                            <TableCell style={{fontSize: "1vw"}} component="th" scope="row" align="center">
                                                {user.rank}
                                            </TableCell>
                                            <TableCell style={{fontSize: "1vw"}} component="th" scope="row" align="center">
                                                {user.mac}
                                            </TableCell>
                                            <TableCell style={{fontSize: "1vw"}} component="th" scope="row" align="center">
                                                {user.name}
                                            </TableCell>
                                            <TableCell style={{fontSize: "1vw"}} component="th" scope="row" align="center">
                                                {user.count}
                                            </TableCell>
                                        </Hidden>
                                        <Hidden only={['md', 'lg', 'xl']}>
                                            {/* Button Mobile */}
                                            <TableCell style={{fontSize: "3vw"}} component="th" scope="row" align="center">
                                                {user.rank}
                                            </TableCell>
                                            <TableCell style={{fontSize: "3vw"}} component="th" scope="row" align="center">
                                                {user.mac}
                                            </TableCell>
                                            <TableCell style={{fontSize: "3vw"}} component="th" scope="row" align="center">
                                                {user.name}
                                            </TableCell>
                                            <TableCell style={{fontSize: "3vw"}} component="th" scope="row" align="center">
                                                {user.count}
                                            </TableCell>
                                        </Hidden>
                                    </TableRow>
                                ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <TablePagination
                            rowsPerPageOptions={[10, 20]}
                            component="div"
                            count={this.state.all_user_count}
                            rowsPerPage={this.state.row_per_page}
                            page={this.state.page_num}
                            onChangePage={this.handleChangePage}
                            onChangeRowsPerPage={this.handleChangeRowsPerPage}
                        />
                    </Grid>
                    <Grid item only={['md', 'lg', 'xl']} md={4}></Grid>
                </Grid>

            </Grid>)
    }
}

export default TopLists;