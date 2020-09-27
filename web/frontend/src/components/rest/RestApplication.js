/*
 Copyright 2020 Karl Dahlgren

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */

import React, {PureComponent} from 'react';
import {Link} from "react-router-dom";
import axios from "axios";
import ToolkitProvider, {Search} from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import PaginationFactory from "react-bootstrap-table2-paginator";
const { SearchBar } = Search;

class RestApplication extends PureComponent {

    constructor(props) {
        super(props);

        this.onRowSelect = this.onRowSelect.bind(this);
        this.onRowSelectAll = this.onRowSelectAll.bind(this);
        this.nameFormat = this.nameFormat.bind(this);

        this.columns = [{
            dataField: 'id',
            text: 'id',
            hidden: true
        }, {
            dataField: 'name',
            text: 'Name',
            sort: true,
            formatter: this.nameFormat
        }, {
            dataField: 'typeIdentifier.type',
            text: 'Type',
            sort: true
        }, {
            dataField: 'description',
            text: 'Description',
            sort: true
        }];

        this.selectRow = {
            mode: 'checkbox',
            onSelect: this.onRowSelect,
            onSelectAll: this.onRowSelectAll
        };

        this.defaultSort = [{
            dataField: 'name',
            order: 'asc'
        }];

        this.state = {
            projectId: this.props.match.params.projectId,
            applicationId: this.props.match.params.applicationId,
            application: {
                resources: []
            }
        };

        this.getApplication(this.state.projectId, this.state.applicationId);
    }



    onRowSelect(value, mode) {

    }

    onRowSelectAll(mode) {

    }

    nameFormat(cell, row) {
        if(cell == null){
            return;
        }

        return (
            <div className="table-link">
                <Link to={"/beta/web/rest/project/" + this.state.projectId + "/application/" + this.state.applicationId + "/resource/" + row.id}>{cell}</Link>
            </div>
        )
    }

    getApplication(projectId, applicationId) {
        axios
            .get("/api/rest/rest/project/" + projectId + "/application/" + applicationId)
            .then(response => {
                this.setState({
                    application: response.data,
                });
            })
            .catch(error => {
                this.props.validateErrorResponse(error);
            });
    }


    render() {
        return (
            <div>
                <section>
                    <div className="navigation">
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb breadcrumb-custom">
                                <li className="breadcrumb-item"><Link to={"/beta/web"}>Home</Link></li>
                                <li className="breadcrumb-item"><Link to={"/beta/web/rest/project/" + this.state.projectId}>Project</Link></li>
                                <li className="breadcrumb-item">{this.state.application.name}</li>
                            </ol>
                        </nav>
                    </div>
                    <div className="content-top">
                        <div className="title">
                            <h1>Application: {this.state.application.name}</h1>
                        </div>
                        <div className="menu" align="right">
                            <a className="btn btn-success demo-button-disabled menu-button" href="/web/project/create"><i
                                className="fas fa-plus-circle"/> <span>Update application</span></a>
                            <a className="btn btn-primary demo-button-disabled menu-button" href="/web/project/import"><i
                                className="fas fa-cloud-upload-alt"/> <span>Delete application</span></a>
                        </div>
                    </div>
                    <div className="panel panel-primary table-panel">
                        <div className="panel-heading table-panel-heading">
                            <h3 className="panel-title">Resources</h3>
                        </div>
                        <div className="table-result">
                            <ToolkitProvider bootstrap4
                                             columns={ this.columns}
                                             data={this.state.application.resources}
                                             keyField="id"
                                             search>
                                {
                                    (props) => (
                                        <div>
                                            <div>
                                                <SearchBar {...props.searchProps} className={"table-filter-field"}/>
                                            </div>
                                            <BootstrapTable {...props.baseProps} bootstrap4
                                                            data={this.state.application.resources} columns={this.columns}
                                                            defaultSorted={this.defaultSort} keyField='id' hover
                                                            selectRow={this.selectRow}
                                                            pagination={ PaginationFactory(PaginationFactory()) }/>
                                        </div>
                                    )}
                            </ToolkitProvider>
                            <div className="panel-buttons">
                                <button className="btn btn-primary panel-button" type="submit" name="action" value="export"><i
                                    className="fas fa-cloud-download-alt"/> <span>Update</span></button>
                                <button className="btn btn-primary demo-button-disabled panel-button" type="submit" name="action"
                                        value="update"><i className="fas fa-trash"/> <span>Update endpoint</span>
                                </button>
                                <button className="btn btn-danger demo-button-disabled panel-button" type="submit" name="action"
                                        value="delete"><i className="fas fa-trash"/> <span>Delete resource</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        )
    }

}

export default RestApplication