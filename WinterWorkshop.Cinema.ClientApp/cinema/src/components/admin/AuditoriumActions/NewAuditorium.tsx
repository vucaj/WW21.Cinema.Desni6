import React, { useEffect, useState } from "react";
import { withRouter } from "react-router-dom";
import {
  FormGroup,
  FormControl,
  Button,
  Container,
  Row,
  Col,
  FormText,
} from "react-bootstrap";
import { NotificationManager } from "react-notifications";
import { serviceConfig } from "../../../appSettings";
import { Typeahead } from "react-bootstrap-typeahead";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCouch } from "@fortawesome/free-solid-svg-icons";
import "./../../../index.css";
import { ICinema } from "../../../models";

interface IState {
  cinemaId: string;
  name: string;
  seatRows: number;
  numberOfSeats: number;
  cinemas: ICinema[];
  cinemaIdError: string;
  auditNameError: string;
  seatRowsError: string;
  numOfSeatsError: string;
  submitted: boolean;
  canSubmit: boolean;
}

const NewAuditorium: React.FC = (props: any) => {
  const [state, setState] = useState<IState>({
    cinemaId: "",
    name: "",
    seatRows: 0,
    numberOfSeats: 0,
    cinemas: [
      {
        id: "",
        name: "",
        addressId: 0,
        cityName: "",
        country: "",
        latitude: 0,
        longitude: 0,
        streetName: ""
      },
    ],
    cinemaIdError: "",
    auditNameError: "",
    seatRowsError: "",
    numOfSeatsError: "",
    submitted: false,
    canSubmit: true,
  });

  const getCinemas = () => {
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
    };

    fetch(`${serviceConfig.baseURL}/api/Cinemas/getAll`, requestOptions)
      .then((response) => {
        if (!response.ok) {
          return Promise.reject(response);
        }
        return response.json();
      })
      .then((data) => {
        if (data) {
          setState({ ...state, cinemas: data });
        }
      })
      .catch((response) => {
        NotificationManager.error(response.message || response.statusText);
        setState({ ...state, submitted: false });
      });
  };

  useEffect(() => {
    getCinemas();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setState({ ...state, [id]: value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setState({ ...state, submitted: true });
    if (
      state.name &&
      state.numberOfSeats &&
      state.cinemaId &&
      state.seatRows
    ) {
      addAuditorium();
    } else {
      NotificationManager.error("Please fill form with data.");
      setState({ ...state, submitted: false });
    }
  };

  const addAuditorium = () => {
    const data = {
      cinemaId: state.cinemaId,
      name: state.name,
      numberOfSeats: +state.numberOfSeats,
      seatRows: +state.seatRows
    };

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
      body: JSON.stringify(data),
    };

    fetch(`${serviceConfig.baseURL}/api/Auditoriums/create`, requestOptions)
      .then((response) => {
        if (!response.ok) {
          return Promise.reject(response);
        }
        return response.statusText;
      })
      .then((result) => {
        NotificationManager.success("Successfuly added new auditorium!");
        props.history.push("AllAuditoriums");
      })
      .catch((response) => {
        NotificationManager.error(response.message || response.statusText);
        setState({ ...state, submitted: false });
      });
  };

  const onCinemaChange = (cinemas: ICinema[]) => {
    if (cinemas[0]) {
      setState({ ...state, cinemaId: cinemas[0].id });
    }
  };

  const renderSeats = (seats, row) => {
    let renderedSeats: JSX.Element[] = [];
    for (let i = 0; i < seats; i++) {
      renderedSeats.push(
        <td id="test" className="rendering-seats" key={`row${row}-seat${i}`}>
          <FontAwesomeIcon className="fa-2x couch-icon" icon={faCouch} />
        </td>
      );
    }
    return renderedSeats;
  };

  const renderRows = (rows: number, seats: number) => {
    const rowsRendered: JSX.Element[] = [];
    for (let i = 0; i < rows; i++) {
      rowsRendered.push(<tr key={i}>{renderSeats(seats, i)}</tr>);
    }
    return rowsRendered;
  };

  return (
    <Container>
      <Row>
        <Col>
          <h1 className="form-header">Add Auditorium</h1>
          <form onSubmit={handleSubmit}>
            <FormGroup>
              <FormControl
                id="name"
                type="text"
                placeholder="Auditorium Name"
                value={state.name}
                onChange={handleChange}
                className="add-new-form"
                maxLength={30}
              />
              <FormText className="text-danger">
                {state.auditNameError}
              </FormText>
            </FormGroup>
            <FormGroup>
              <Typeahead
                labelKey="name"
                className="add-new-form"
                options={state.cinemas}
                placeholder="Choose a cinema..."
                id="browser"
                onChange={(e: ICinema[]) => {
                  onCinemaChange(e);
                }}
              />
              <FormText className="text-danger">{state.cinemaIdError}</FormText>
            </FormGroup>
            <label className="label-nos">Number of Rows: </label>
            <FormGroup>
              <FormControl
                id="seatRows"
                className="add-new-form"
                type="number"
                placeholder="Number Of Rows"
                value={state.seatRows.toString()}
                onChange={handleChange}
                min={1}
                max={150}
              />
              <FormText className="text-danger">{state.seatRowsError}</FormText>
            </FormGroup>
            <label className="label-nos">Number of seats: </label>
            <FormGroup>
              <FormControl
                id="numberOfSeats"
                className="add-new-form"
                type="number"
                placeholder="Number Of Seats"
                value={state.numberOfSeats.toString()}
                onChange={handleChange}
                min={1}
                max={150}
              />
              <FormText className="text-danger">
                {state.numOfSeatsError}
              </FormText>
            </FormGroup>
            <Button
              type="submit"
              className="btn-add-new"
              disabled={state.submitted || !state.canSubmit}
              block
            >
              Add
            </Button>
          </form>
        </Col>
      </Row>
      <Row className="mt-2">
        <Col className="justify-content-center align-content-center">
          <h1 className="form-header">Auditorium Preview</h1>
          <div>
            <Row className="justify-content-center mb-4">
              <div className="text-center text-white font-weight-bold cinema-screen">
                CINEMA SCREEN
              </div>
            </Row>
            <Row className="justify-content-center">
              <table className="table-cinema-auditorium">
                <tbody>{renderRows(state.seatRows, state.numberOfSeats)}</tbody>
              </table>
            </Row>
          </div>
        </Col>
      </Row>
    </Container>
  );
};
export default withRouter(NewAuditorium);
