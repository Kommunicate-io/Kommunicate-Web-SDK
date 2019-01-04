import React from 'react';
import Login from "../src/views/Pages/Login/Login.js";
import renderer from 'react-test-renderer';


test('Snapshot for Login', () => {
  const component = renderer.create(
    <Login />
  );
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();

});