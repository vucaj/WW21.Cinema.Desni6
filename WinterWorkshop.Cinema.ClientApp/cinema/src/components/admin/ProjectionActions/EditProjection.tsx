import React, { useEffect, useState } from "react";
import { withRouter } from "react-router-dom";
import {
  FormGroup,
  Button,
  Container,
  Row,
  Col,
  FormText,
} from "react-bootstrap";
import { NotificationManager } from "react-notifications";
import { serviceConfig } from "../../../appSettings";
import { Typeahead } from "react-bootstrap-typeahead";
import DateTimePicker from "react-datetime-picker";
import { IMovie, IAuditorium } from "../../../models";

interface IState {
  projectionTime: string;
  movieId: string;
  auditoriumId: string;
  submitted: boolean;
  projectionTimeError: string;
  movieIdError: string;
  auditoriumIdError: string;
  movies: IMovie[];
  auditoriums: IAuditorium[];
  canSubmit: boolean;
}

const EditProjection: React.FC = (props: any) => {
  const [state, setState] = useState<IState>({
    projectionTime: "",
    movieId: "",
    auditoriumId: "",
    submitted: false,
    projectionTimeError: "",
    movieIdError: "",
    auditoriumIdError: "",
    movies: [
      {
        id: "",
        bannerUrl: "",
        title: "",
        year: 0,
        isActive: false,
        duration: 0,
        distributer: "",
        description: "",
        genre: 0,
        rating: 0,
        numberOfOscars: 0,
      },
    ],
    auditoriums: [
      {
        id: "",
        name: "",
      },
    ],
    canSubmit: true,
  });

  useEffect(() => {
    getProjections();
    getAuditoriums();
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setState({ ...state, [id]: value });
  };

  const validate = (id, value) => {
    if (id === "projectionTime") {
      if (!value) {
        setState({
          ...state,
          projectionTimeError: "Chose projection time",
          canSubmit: false,
        });
      } else {
        setState({ ...state, projectionTimeError: "", canSubmit: true });
      }
    } else if (id === "movieId") {
      if (!value) {
        setState({
          ...state,
          movieIdError: "Please chose movie from dropdown",
          canSubmit: false,
        });
      } else {
        setState({ ...state, movieIdError: "", canSubmit: true });
      }
    } else if (id === "auditoriumId") {
      if (!value) {
        setState({
          ...state,
          auditoriumIdError: "Please chose auditorium from dropdown",
          canSubmit: false,
        });
      } else {
        setState({ ...state, auditoriumIdError: "", canSubmit: true });
      }
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setState({ ...state, submitted: true });

    const { movieId, auditoriumId, projectionTime } = state;
    if (movieId && auditoriumId && projectionTime) {
      var idFromUrl = window.location.pathname.split("/");
      var id = idFromUrl[3];
      editProjection(id);
    } else {
      NotificationManager.error("Please fill in data");
      setState({ ...state, submitted: false });
    }
  };

  const editProjection = (projectionId: string) => {
    const data = {
      movieId: state.movieId,
      auditoriumId: state.auditoriumId,
      projectionTime: state.projectionTime,
    };

    const requestOptions = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
      body: JSON.stringify(data),
    };

    fetch(
      `${serviceConfig.baseURL}/api/projections/${projectionId}`,
      requestOptions
    )
      .then((response) => {
        if (!response.ok) {
          return Promise.reject(response);
        }
        return response.statusText;
      })
      .then((result) => {
        NotificationManager.success("Projection edited successfully!");
        props.history.goBack();
      })
      .catch((response) => {
        NotificationManager.error(response.message || response.statusText);
        setState({ ...state, submitted: false });
      });
  };

  const getProjections = () => {
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
    };

    fetch(`${serviceConfig.baseURL}/api/Movies/current`, requestOptions)
      .then((response) => {
        if (!response.ok) {
          return Promise.reject(response);
        }
        return response.json();
      })
      .then((data) => {
        if (data) {
          setState({ ...state, movies: data });
        }
      })
      .catch((response) => {
        NotificationManager.error(response.message || response.statusText);
        setState({ ...state, submitted: false });
      });
  };

  const getAuditoriums = () => {
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
    };

    fetch(`${serviceConfig.baseURL}/api/Auditoriums/all`, requestOptions)
      .then((response) => {
        if (!response.ok) {
          return Promise.reject(response);
        }
        return response.json();
      })
      .then((data) => {
        if (data) {
          setState({ ...state, auditoriums: data });
        }
      })
      .catch((response) => {
        NotificationManager.error(response.message || response.statusText);
        setState({ ...state, submitted: false });
      });
  };

  const onMovieChange = (movies: IMovie[]) => {
    if (movies[0]) {
      setState({ ...state, movieId: movies[0].id });
      validate("movieId", movies[0]);
    } else {
      validate("movieId", null);
    }
  };

  const onAuditoriumChange = (auditoriums: IAuditorium[]) => {
    if (auditoriums[0]) {
      setState({ ...state, auditoriumId: auditoriums[0].id });
      validate("auditoriumId", auditoriums[0]);
    } else {
      validate("auditoriumId", null);
    }
  };

  const onDateChange = (date: Date) =>
    setState({ ...state, projectionTime: date.toLocaleTimeString() });

  return (
    <Container>
      <Row>
        <Col>
          <h1 className="form-header">Edit Projection</h1>
          <form onSubmit={handleSubmit}>
            <FormGroup>
              <Typeahead
                labelKey="title"
                options={state.movies}
                placeholder="Choose a movie..."
                id="movie"
                onChange={(e: IMovie[]) => {
                  onMovieChange(e);
                }}
              />
              <FormText className="text-danger">{state.movieIdError}</FormText>
            </FormGroup>
            <FormGroup>
              <Typeahead
                labelKey="name"
                options={state.auditoriums}
                placeholder="Choose auditorium..."
                id="auditorium"
                onChange={(e: IAuditorium[]) => {
                  onAuditoriumChange(e);
                }}
              />
              <FormText className="text-danger">
                {state.auditoriumIdError}
              </FormText>
            </FormGroup>
            <FormGroup>
              <DateTimePicker
                className="form-control"
                onChange={onDateChange}
                value={state.projectionTime}
              />
              <FormText className="text-danger">
                {state.projectionTimeError}
              </FormText>
            </FormGroup>
            <Button
              type="submit"
              disabled={state.submitted || !state.canSubmit}
              block
            >
              Add Projection
            </Button>
          </form>
        </Col>
      </Row>
    </Container>
  );
};

export default withRouter(EditProjection);
