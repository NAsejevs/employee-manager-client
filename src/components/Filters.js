import React from "react";
import { connect } from "react-redux";
import Cookies from 'universal-cookie';

import { Form, Button, Collapse, Row, Col, Dropdown, DropdownButton } from "react-bootstrap";
import BoostrapDatePicker from "./BoostrapDatePicker";

import { FiMinimize2, FiMaximize2 } from "react-icons/fi";

class Filters extends React.Component {
    constructor() {
        super();

        const startDate = new Date();
		startDate.setHours(0,0,0);

		const endDate = new Date();
		endDate.setHours(23,59,59);

        this.state = {
            showFilters: false,
			showArchive: false,
			showInactive: false,
			showWorking: false,
			showNotWorking: false,
			nameFilter: "",
			positionFilter: "",
            companyFilter: "",
            startDate: startDate,
            endDate: endDate,
            
			dropdown: {
				currentFilter: "Šodiena",
				filters: ["Šodiena", "Vakardiena", "Pēdējās 7 dienas", "Pēdējās 30 dienas"]
			}
        }
    }

    componentWillMount() {
		const cookies = new Cookies();
		let settings = cookies.get("settings");

		if(settings) {
			this.setState({
                ...settings,
				startDate: new Date(settings.startDate),
				endDate: new Date(settings.endDate),
			});
		} else {
            const startDate = new Date();
            startDate.setHours(0,0,0);
    
            const endDate = new Date();
            endDate.setHours(23,59,59);

			settings = {
				showFilters: false,
				showArchive: false,
				showInactive: false,
				showWorking: false,
				showNotWorking: false,
				nameFilter: "",
				positionFilter: "",
                companyFilter: "",
                startDate: startDate,
                endDate: endDate,
			}

			cookies.set("settings", settings);
		}
    }
    
    componentDidMount() {
        this.props.filterData(this.filterData);
    }

    componentWillUnmount() {
        this.props.filterData(undefined);
    }

    componentDidUpdate(prevProps, prevState) {
        if(
			prevState.showArchive !== this.state.showArchive
			|| prevState.showInactive !== this.state.showInactive
			|| prevState.showWorking !== this.state.showWorking
			|| prevState.showNotWorking !== this.state.showNotWorking
			|| prevState.nameFilter !== this.state.nameFilter
			|| prevState.positionFilter !== this.state.positionFilter
            || prevState.companyFilter !== this.state.companyFilter
            || prevState.startDate !== this.state.startDate
            || prevState.endDate !== this.state.endDate) {
			this.onFilterChange();
        }
        
        if(
			prevState.showFilters !== this.state.showFilters
			||prevState.showArchive !== this.state.showArchive
			|| prevState.showInactive !== this.state.showInactive
			|| prevState.showWorking !== this.state.showWorking
			|| prevState.showNotWorking !== this.state.showNotWorking
			|| prevState.nameFilter !== this.state.nameFilter
			|| prevState.positionFilter !== this.state.positionFilter
            || prevState.companyFilter !== this.state.companyFilter
            || prevState.startDate !== this.state.startDate
            || prevState.endDate !== this.state.endDate) {
			this.saveSettings();
		}
    }

    saveSettings = () => {
		const cookies = new Cookies();
		const settings = {
            ...cookies.get("settings"),
			showFilters: this.state.showFilters,
			showArchive: this.state.showArchive,
			showInactive: this.state.showInactive,
			showWorking: this.state.showWorking,
			showNotWorking: this.state.showNotWorking,
			nameFilter: this.state.nameFilter,
			positionFilter: this.state.positionFilter,
            companyFilter: this.state.companyFilter,
            startDate: this.state.startDate,
            endDate: this.state.endDate,
		}

		cookies.set("settings", settings);
    }

    onFilterChange = () => {
        this.props.onFilterChange(this.state);
    }

    filterData = (tableData) => {
		this.applyNameFilter(tableData, (nameFilter) => {
			this.applyPositionFilter(nameFilter, (positionFilter) => {
				this.applyCompanyFilter(positionFilter, (companyFilter) => {
					this.applyCheckboxFilters(companyFilter, (checkboxFilter) => {
						this.props.onDataFiltered(checkboxFilter);
					});
				});
			});
		});
    }
    
    applyNameFilter = (data, callback = () => null) => {
		const result = data.filter((row) => {
			return (row.name.name + " " + row.name.surname).toString().toLowerCase().indexOf(this.state.nameFilter.toLowerCase()) > -1;
		});
		callback(result);
	}

	applyCompanyFilter = (data, callback = () => null) => {
		const result = data.filter((row) => {
			const company = row.company ? row.company : "";
			return company.toString().toLowerCase().indexOf(this.state.companyFilter.toLowerCase()) > -1;
		});
		callback(result);
	}

	applyPositionFilter = (data, callback = () => null) => {
		const result = data.filter((row) => {
			const position = row.position ? row.position : "";
			return position.toString().toLowerCase().indexOf(this.state.positionFilter.toLowerCase()) > -1;
		});
		callback(result);
	}

	applyCheckboxFilters = (data, callback = () => null) => {
		const result = data.filter((row) => {
			if(row.archived && !this.state.showArchive) {
				return false;
			}
			if(!row.active && !this.state.showInactive) {
				return false;
			}
			if(row.working && this.state.showNotWorking) {
				return false;
			}
			if(!row.working && this.state.showWorking) {
				return false;
			}
			return true;
		});
		callback(result);
	}

    onToggleFilters = () => {
		this.setState({ showFilters: !this.state.showFilters });
	}

    onToggleArchive = () => {
		this.setState({ showArchive: !this.state.showArchive });
	}

	onToggleInactive = () => {
		this.setState({ showInactive: !this.state.showInactive });
	}

	onToggleShowWorking = () => {
		this.setState({ showWorking: !this.state.showWorking });
	}

	onToggleShowNotWorking = () => {
		this.setState({ showNotWorking: !this.state.showNotWorking });
	}

	onChangeNameFilter = (e) => {
		this.setState({ nameFilter: e.target.value });
	}

	onChangePositionFilter = (e) => {
		this.setState({ positionFilter: e.target.value });
	}

	onChangeCompanyFilter = (e) => {
		this.setState({ companyFilter: e.target.value });
    }
    
    onChangeDateStart = (date) => {
		const startOfDay = new Date(date);
		startOfDay.setHours(0,0,0);
		this.setState({
			startDate: startOfDay,
		});
	}

	onChangeDateEnd = (date) => {
		const endOfDay = new Date(date);
		endOfDay.setHours(23,59,59);
		this.setState({
			endDate: endOfDay,
		});
    }
    
    onClickFilter = (index) => {
		switch(index) {
			case 0: {
				this.onChangeDateStart(new Date());
				this.onChangeDateEnd(new Date());
				break;
			}
			case 1: {
				const yesterday = new Date();
				yesterday.setDate(yesterday.getDate() - 1);
				this.onChangeDateStart(yesterday);
				this.onChangeDateEnd(yesterday);
				break;
			}
			case 2: {
				const last7Days = new Date();
				last7Days.setDate(last7Days.getDate() - 7);
				this.onChangeDateStart(last7Days);
				this.onChangeDateEnd(new Date());
				break;
			}
			case 3: {
				const last30Days = new Date();
				last30Days.setDate(last30Days.getDate() - 30);
				this.onChangeDateStart(last30Days);
				this.onChangeDateEnd(new Date());
				break;
			}
			default: {
				this.onChangeDateStart(new Date());
				this.onChangeDateEnd(new Date());
				break;
			}
		}

		this.setState({
			dropdown: {
				...this.state.dropdown,
				currentFilter: this.state.dropdown.filters[index],
			}			
		})
	}

	clearAllFilters = () => {
		const startDate = new Date();
		startDate.setHours(0,0,0);

		const endDate = new Date();
		endDate.setHours(23,59,59);

		this.setState({
			nameFilter: "",
			positionFilter: "",
			companyFilter: "",
			showArchive: false,
			showInactive: false,
			showWorking: false,
			showNotWorking: false,
			startDate: startDate,
			endDate: endDate,
		});
    }
    
	render() {
        const dateFilter = (
            <>
                <Col xs={"auto"}>
                    <Form.Group as={Row}>
                        <Form.Label column xs={"auto"} className="pr-0">Dati no</Form.Label>
                        <Col>
                            <BoostrapDatePicker
                                dateFormat="dd.MM.yyyy."
                                selected={this.state.startDate}
                                onChange={this.onChangeDateStart}
                                maxDate={new Date()}
                            />
                        </Col>
                    </Form.Group>
                </Col>
                <Col xs={"auto"}>
                    <Form.Group as={Row}>
                        <Form.Label column xs={"auto"} className="pl-0 pr-0">līdz</Form.Label>
                        <Col>
                            <BoostrapDatePicker
                                dateFormat="dd.MM.yyyy."
                                selected={this.state.endDate}
                                onChange={this.onChangeDateEnd}
                                minDate={this.state.startDate}
                                maxDate={new Date()}
                            />
                        </Col>
                    </Form.Group>
                </Col>
                <Col xs={"auto"}>
                    <DropdownButton
                        alignRight
                        variant="secondary"
                        title={this.state.dropdown.currentFilter}
                    >
                    {
                        this.state.dropdown.filters.map((filter, index) => {
                            return <Dropdown.Item key={index} onClick={() => this.onClickFilter(index)}>{filter}</Dropdown.Item>
                        })
                    }
                    </DropdownButton>
                </Col>
            </>
        );

		return (
            <Row>
                <Col>
                    <Row>
                        <Col>
                            <Button 
                                variant="link" 
                                onClick={this.onToggleFilters}
                                className="float-left"
                            >
                                {
                                    this.state.showFilters
                                    ? <FiMinimize2 className="mr-2 mb-1"/>
                                    : <FiMaximize2 className="mr-2 mb-1"/>
                                }
                                Filtri
                            </Button>
                            <Dropdown alignRight className="float-right">
                                <Dropdown.Toggle variant="link">
                                    Opcijas
                                </Dropdown.Toggle>

                                <Dropdown.Menu>
                                    <Dropdown.Item onClick={this.props.showRegisterEmployee}>Pievienot darbinieku</Dropdown.Item>
                                    <Dropdown.Item onClick={this.props.showCheckCard}>Atrast darbinieku pēc kartes</Dropdown.Item>
                                    <Dropdown.Item onClick={this.props.showExportExcel}>Eksportēt Excel</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Collapse in={this.state.showFilters}>
                                <div>
                                    <Row>
                                        <Col>
                                            <Form.Group>
                                                <Form.Check 
                                                    type="checkbox" 
                                                    label="Rādīt arhīvā esošos darbiniekus"
                                                    checked={this.state.showArchive}
                                                    onChange={this.onToggleArchive}
                                                />
                                            </Form.Group>
                                            <Form.Group>
                                                <Form.Check 
                                                    type="checkbox" 
                                                    label="Rādīt deaktivizētus darbiniekus"
                                                    checked={this.state.showInactive}
                                                    onChange={this.onToggleInactive}
                                                />
                                            </Form.Group>
                                            <Form.Group>
                                                <Form.Check 
                                                    type="checkbox" 
                                                    label="Rādīt tikai ienākušos darbiniekus"
                                                    checked={this.state.showWorking}
                                                    onChange={this.onToggleShowWorking}
                                                />
                                            </Form.Group>
                                            <Form.Group>
                                                <Form.Check 
                                                    type="checkbox" 
                                                    label="Rādīt tikai izgājušos darbiniekus"
                                                    checked={this.state.showNotWorking}
                                                    onChange={this.onToggleShowNotWorking}
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col>
                                            <Form.Group>
                                                <Form.Control
                                                    placeholder="Vārds..."
                                                    onChange={this.onChangeNameFilter}
                                                    value={this.state.nameFilter}
                                                />
                                                <Form.Text>
                                                    Meklēt darbinieku pēc vārda vai uzvārda
                                                </Form.Text>
                                            </Form.Group>
                                            <Form.Group>
                                                <Form.Control
                                                    placeholder="Amats..."
                                                    onChange={this.onChangePositionFilter}
                                                    value={this.state.positionFilter}
                                                />
                                                <Form.Text>
                                                    Meklēt darbinieku pēc amata
                                                </Form.Text>
                                            </Form.Group>
                                            <Form.Group>
                                                <Form.Control
                                                    placeholder="Uzņēmums..."
                                                    onChange={this.onChangeCompanyFilter}
                                                    value={this.state.companyFilter}
                                                />
                                                <Form.Text>
                                                    Meklēt darbinieku pēc uzņēmuma
                                                </Form.Text>
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Row>
                                        {
                                            this.props.dateFilter
                                            ? dateFilter
                                            : null
                                        }
                                        <Col>
                                            <Button
                                                variant="danger"
                                                onClick={this.clearAllFilters}
                                                className="float-right"
                                            >
                                                <nobr>Notīrīt visus filtrus</nobr>
                                            </Button>
                                        </Col>
                                    </Row>
                                </div>
                            </Collapse>
                        </Col>
                    </Row>
                </Col>
            </Row>
		);
	}
}

function mapStateToProps(state) {
	return {
	};
}

function mapDispatchToProps(dispatch) {
	return {
	};
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Filters);
