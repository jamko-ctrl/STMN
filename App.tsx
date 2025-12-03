import React from 'react';
import { StatusBar } from 'react-native';
import { WorkoutLogger } from './app/screens/WorkoutLogger';

export default function App() {
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      <WorkoutLogger />
    </>
  );
}
