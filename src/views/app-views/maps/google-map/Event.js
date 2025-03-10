import React, { Component } from 'react'
import GoogleMap  from 'google-map-react';

const Marker = ({text}) => (
	<img className="cursor-pointer" src="/img/others/marker.png" alt="" />
);

export class Event extends Component {

	state= {
		center: [59.838043, 30.337157],
    zoom: 9,
    greatPlaces: [
      {id: 'A', lat: 59.955413, lng: 30.337844},
      {id: 'B', lat: 59.724, lng: 30.080}
    ]
	}

	onChange = (props) => {
  }

  onClick = (value) => {
		const {lat, lng} = value;
		this.setState({
			center: [lat, lng]
		})
  }

  onChildMouseEnter = (key , childProps ) => {
  }

  onChildMouseLeave = (key , childProps ) => {
  }

	render() {
		const places = this.state.greatPlaces
      .map(place => {
        const {id, ...coords} = place;
        return (
          <Marker
            key={id}
            {...coords}
            text={id} />
        );
      });

		return (
			<div style={{ height: '500px', width: '100%' }}>
				<GoogleMap
					center={this.state.center}
					zoom={this.state.zoom}
					hoverDistance={20}
					onChange={this.onChange}
					onClick={this.onClick}
					onChildMouseEnter={this.onChildMouseEnter}
					onChildMouseLeave={this.onChildMouseLeave}
				>
					{places}
      	</GoogleMap>
			</div>
		)
	}
}

export default Event
