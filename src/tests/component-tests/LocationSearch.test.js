/*
helpful links:
https://www.npmjs.com/package/jest-googleapi-mock
https://stackoverflow.com/questions/60334129/react-testing-with-jest-and-enzyme-react-google-maps-api-returns-typeerror-can
https://janmonschke.com/projects/geomock.html
*/

import React from "react";
import { shallow, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import createGoogleMapsMock from 'jest-google-maps-mock';
 
import LocationSearch from "../../components/LocationSearch.js";

describe('Component: LocationSearch', () => {
  var enzyme = require('enzyme');
  enzyme.configure({ adapter: new Adapter() });
  let googleMaps;
 
  beforeEach(() => {
    googleMaps = createGoogleMapsMock();
  });
 
  it('should create a map mock', () => {
    const mapDiv = document.createElement('div');
    new googleMaps.Map(mapDiv);
 
    expect(googleMaps.Map).toHaveBeenCalledTimes(1);
    expect(googleMaps.Map.mock.instances.length).toBe(1);
    expect(googleMaps.Map).toHaveBeenLastCalledWith(mapDiv);
  });

  it('Renders correctly', () => {
    const parentCallback = jest.fn();
    const error = "";
    const address = "1421 Bolling Avenue, Norfolk, VA, USA";
    const wrap = enzyme.mount(<LocationSearch parentCallback={parentCallback} error={error} address={address}/>)
    expect(wrap).toMatchSnapshot();
  });

  it('change address', () => {
    const parentCallback = jest.fn();
    const error = "";
    const address = "1421 Bolling Avenue, Norfolk, VA, USA"; //{lat: -34.397, lng: 150.644}
    const wrap = enzyme.mount(<LocationSearch parentCallback={parentCallback} error={error} address={address}/>)
    const locBar = wrap.find('#loc-bar').at(0);
    locBar.props().onChange("", { value: { description: "1421 Bolling Avenue, Norfolk, VA, USA"} });
    expect(parentCallback.mock.calls.length).toBe(1);
    expect(parentCallback.mock.calls[0][0].address).toBe("1421 Bolling Avenue, Norfolk, VA, USA");
  });

})