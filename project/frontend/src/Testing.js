import React from 'react';
import { useFetchEmissions } from './hooks/useFetchEmissions';

function Test({query, value}) {
    const {data, loading, error} = useFetchEmissions(query, value);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
      <div>
      <h1>Emissions Data</h1>
      <div id="qresult">
        {data && data.map((element, index) => (
          <p key={index}>Entity: {element["Entity"]}, Cumulative Emissions: {element["Cumulative CO2 emissions"]}, Year: {element["Year"]}</p>
        ))}
      </div>
    </div>
    );
  }
  
export default Test;