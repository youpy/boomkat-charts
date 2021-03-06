import React, { Component } from "react";
import LazyLoad from "react-lazy-load";
import qs from "query-string";

const initialState = {
  artistFilter: "",
  genreFilter: "",
  labelFilter: "",
  titleFilter: "",
  chartByFilter: "",
  chart_by: []
};

export default class App extends Component {
  componentWillMount() {
    this.state = initialState;
  }

  getStateFromHash() {
    const params = qs.parse(location.hash);
    var newState = {};

    if (params.artist) {
      newState.artistFilter = params.artist.toLowerCase();
    }

    if (params.label) {
      newState.labelFilter = params.label.toLowerCase();
    }

    if (params.genre) {
      newState.genreFilter = params.genre.toLowerCase();
    }

    if (params.chart_by) {
      newState.chartByFilter = params.chart_by.toLowerCase();
    }

    return newState;
  }

  onHashChange() {
    const stateFromHash = this.getStateFromHash();

    this.setState(
      Object.assign(
        {},
        initialState,
        { chart_by: this.state.chart_by },
        stateFromHash
      )
    );

    if (Object.keys(stateFromHash).length !== 0) {
      window.scroll(0, 0);
    }
  }

  componentDidMount() {
    const chart_by = this.props.chart.reduce((memo, item) => {
      return Object.assign(memo, item.chart_by);
    }, {});

    window.onhashchange = this.onHashChange.bind(this);

    this.setState(
      Object.assign({}, this.state, this.getStateFromHash(), {
        chart_by: Object.keys(chart_by).sort()
      })
    );
  }

  componentWillUnmount() {
    window.onhashchange = null;
  }

  onChangeArtistFilter(e) {
    this.setState(
      Object.assign({}, this.state, {
        artistFilter: e.target.value.toLowerCase()
      })
    );
  }

  onChangeTitleFilter(e) {
    this.setState(
      Object.assign({}, this.state, {
        titleFilter: e.target.value.toLowerCase()
      })
    );
  }

  onChangeLabelFilter(e) {
    this.setState(
      Object.assign({}, this.state, {
        labelFilter: e.target.value.toLowerCase()
      })
    );
  }

  onChangeGenreFilter(e) {
    this.setState(
      Object.assign({}, this.state, {
        genreFilter: e.target.value.toLowerCase()
      })
    );
  }

  onChangeChartByFilter(e) {
    this.setState(
      Object.assign({}, this.state, {
        chartByFilter: e.target.value.toLowerCase()
      })
    );
  }

  renderItem(item) {
    return (
      <div className="item" key={item.title + item.artist}>
        <LazyLoad height={150}>
          <img src={item.img_url} height="150" />
        </LazyLoad>
        <div className="info">
          {item.url && (
            <h2 className="flow-text">
              <a href={`https://www.boomkat.com${item.url}`}>
                {item.artist} / {item.title}
              </a>
            </h2>
          )}
          {!item.url && (
            <h2 className="flow-text">
              {item.artist} / {item.title}
            </h2>
          )}
          <div className="label">
            <a href={`#label=${encodeURIComponent(item.label)}`}>
              {item.label}
            </a>
          </div>
          <div className="genre">
            <a href={`#genre=${encodeURIComponent(item.genre)}`}>
              {item.genre}
            </a>
          </div>
          <ul className="by">
            {Object.keys(item.chart_by).map(who => (
              <li
                key={who}
                className="chip"
                style={{
                  border: item.chart_by[who] === 1 ? "#ccc 2px solid" : null,
                  background:
                    who.toLowerCase() === this.state.chartByFilter
                      ? "#fcc"
                      : null
                }}
              >
                <a href={`#chart_by=${encodeURIComponent(who)}`}>{who}</a>:{" "}
                {item.chart_by[who]}
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  render() {
    const items = this.props.chart
      .filter(item => {
        if (this.state.artistFilter !== "") {
          return (
            item.artist.toLowerCase().indexOf(this.state.artistFilter) !== -1
          );
        } else {
          return true;
        }
      })
      .filter(item => {
        if (this.state.titleFilter !== "") {
          return (
            item.title.toLowerCase().indexOf(this.state.titleFilter) !== -1
          );
        } else {
          return true;
        }
      })
      .filter(item => {
        if (this.state.genreFilter !== "") {
          return (
            item.genre.toLowerCase().indexOf(this.state.genreFilter) !== -1
          );
        } else {
          return true;
        }
      })
      .filter(item => {
        if (this.state.labelFilter !== "") {
          return (
            item.label.toLowerCase().indexOf(this.state.labelFilter) !== -1
          );
        } else {
          return true;
        }
      })
      .filter(item => {
        if (this.state.chartByFilter !== "") {
          return (
            Object.keys(item.chart_by)
              .join(" ")
              .toLowerCase()
              .indexOf(this.state.chartByFilter) !== -1
          );
        } else {
          return true;
        }
      });

    const who = this.state.chart_by.find(
      who => who.toLowerCase() === this.state.chartByFilter
    );
    if (who) {
      items.sort((a, b) => a.chart_by[who] - b.chart_by[who]);
    }

    return (
      <div>
        <h1>
          <a href="./">Boomkat Charts 2020: Merged</a>
        </h1>
        <div className="row">
          <div className="input-field col s12 m6 l2">
            <input
              className="validate"
              id="artist"
              type="text"
              onChange={this.onChangeArtistFilter.bind(this)}
              value={this.state.artistFilter}
            />
            <label
              for="artist"
              className={this.state.artistFilter !== "" ? "active" : ""}
            >
              Artist
            </label>
          </div>
          <div className="input-field col s12 m6 l2">
            <input
              id="title"
              type="text"
              onChange={this.onChangeTitleFilter.bind(this)}
              value={this.state.titleFilter}
            />
            <label
              for="title"
              className={this.state.titleFilter !== "" ? "active" : ""}
            >
              Title
            </label>
          </div>
          <div className="input-field col s12 m6 l2">
            <input
              id="label"
              type="text"
              onChange={this.onChangeLabelFilter.bind(this)}
              value={this.state.labelFilter}
            />
            <label
              for="label"
              className={this.state.labelFilter !== "" ? "active" : ""}
            >
              Label
            </label>
          </div>
          <div className="input-field col s12 m6 l2">
            <input
              id="genre"
              type="text"
              onChange={this.onChangeGenreFilter.bind(this)}
              value={this.state.genreFilter}
            />
            <label
              for="genre"
              className={this.state.genreFilter !== "" ? "active" : ""}
            >
              Genre
            </label>
          </div>
          <div className="input-field col s12 m12 l4">
            <input
              id="chart_by"
              type="text"
              onChange={this.onChangeChartByFilter.bind(this)}
              value={this.state.chartByFilter}
            />
            <label
              for="chart_by"
              className={this.state.chartByFilter !== "" ? "active" : ""}
            >
              Chart By
            </label>
          </div>
        </div>
        <div className="items">{items.map(item => this.renderItem(item))}</div>
      </div>
    );
  }
}
