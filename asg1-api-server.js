const express = require('express');
const supa = require('@supabase/supabase-js');
const app = express();

const supabase = supa.createClient(supaUrl, supaAnonKey);

const jsonMessage = (msg) => {
    return { message: msg };
};

function displayErrorParam(res, param1, param2 = null, param3 = null) {
    if (param2 == null && param3 == null) {
        return res.send(jsonMessage(`Error fetching data: ${param1} is not a valid parameter`));
    } else {
        return res.send(jsonMessage(`Error fetching data: one of the parameters is not a valid type`));

    }
}

function displayErrorFetch(res) {
    return res.send(jsonMessage(`Error fetching data: The path is broken or the database does not exist`));
}

function displayNoData(res, param1, param2 = null, param3 = null) {
    if (param2 == null) {
        return res.send(jsonMessage(`Query using parameter ${param1} does not exist on the database`));
    } else if (param3 == null) {
        return res.send(jsonMessage(`Query using parameters ${param1} and ${param2} does not exist on the database`));
    } else {
        return res.send(jsonMessage(`Query using parameters ${param1}, ${param2}, and ${param3} does not exist on the database`));
    }

}

/**
 * Returns all the data from the seasons table
 */
app.get('/api/seasons', async (req, res) => {
    const { data, error } = await supabase
        .from('seasons')
        .select();
    if (error) {
        return displayErrorFetch(res);
    }

    res.send(data);
});

/**
 * Returns all the data from the circuits table
 */
app.get('/api/circuits', async (req, res) => {
    const { data, error } = await supabase
        .from('circuits')
        .select();
    if (error) {
        return displayErrorFetch(res);
    }

    res.send(data);
});

/**
 * Returns the data of the specified circuit from the circuits table
 */
app.get('/api/circuits/:circuitRef', async (req, res) => {
    const { data, error } = await supabase
        .from('circuits')
        .select()
        .eq('circuitRef', req.params.circuitRef);

    if (error) {
        return displayErrorParam(res, req.params.circuitRef);
    } else if (data.length < 1 || data == null) {
        return displayNoData(res, req.params.circuitRef);
    }

    res.send(data);
});

/**
 * Returns all the circuit data in a given season (year). Sorted by round in ascending order
 */
app.get('/api/circuits/season/:year', async (req, res) => {
    const { data, error } = await supabase
        .from(`races`)
        .select(`round, circuits(*)`)
        .eq('year', req.params.year)
        .order('round', { ascending: true });

    if (error) {
        return displayErrorParam(res, req.params.year);
    } else if (data.length < 1 || data == null) {
        return displayNoData(res, req.params.year);
    }

    res.send(data);
});

/**
 * Returns all the data from the constructors table
 */
app.get('/api/constructors', async (req, res) => {
    const { data, error } = await supabase
        .from('constructors')
        .select();

    if (error) {
        return displayErrorFetch(res);
    }

    res.send(data);
});

/**
 * Returns  the data of the specified constructor from the constructors table
 */
app.get('/api/constructors/:constructorRef', async (req, res) => {
    const { data, error } = await supabase
        .from('constructors')
        .select()
        .eq('constructorRef', req.params.constructorRef.toLowerCase());

    if (error) {
        return displayErrorFetch(res);
    } else if (data.length < 1 || data == null) {
        return displayNoData(res, req.params.constructorRef);
    }

    res.send(data);
});

/**
 * Returns all the data from the drivers table
 */
app.get('/api/drivers', async (req, res) => {
    const { data, error } = await supabase
        .from('drivers')
        .select();

    if (error) {
        return displayErrorFetch(res);
    }

    res.send(data);
});

/**
 * Returns the data of the specified driver from the drivers table
 */
app.get('/api/drivers/:driverRef', async (req, res) => {
    const { data, error } = await supabase
        .from('drivers')
        .select()
        .eq('driverRef', req.params.driverRef);

    if (error) {
        return displayErrorParam(res, req.params.driverRef);
    } else if (data.length < 1 || data == null) {
        return displayNoData(res, req.params.driverRef);
    }

    res.send(data);
});

/**
 * Returns the drivers whose surname (case insensitive) begins with the substring parameter)
 */
app.get('/api/drivers/search/:substring', async (req, res) => {
    const { data, error } = await supabase
        .from('drivers')
        .select()
        .ilike('surname', `${req.params.substring}%`);


    if (error) {
        return displayErrorParam(res, req.params.substring);
    } else if (data.length < 1 || data == null) {
        return displayNoData(res, req.params.substring);
    }

    res.send(data);
});

/**
 * Returns all driver data from a given raceId
 */
app.get('/api/drivers/race/:raceId', async (req, res) => {
    const { data, error } = await supabase
        .from('results')
        .select(`drivers(*)`)
        .eq('raceId', req.params.raceId);

    if (error) {
        return displayErrorParam(res, req.params.raceId);
    } else if (data.length < 1 || data == null) {
        return displayNoData(res, req.params.raceId);
    }

    res.send(data);
});

/**
 * Returns the data of the specified race from the races table
 */
app.get('/api/races/:raceId', async (req, res) => {
    const { data, error } = await supabase
        .from('races')
        .select(`raceId, year, round, name, date, time, url, fp1_date,
                 fp1_time, fp2_date, fp2_time,
                 fp3_date, fp3_time, quali_date,
                 quali_time, sprint_date,
                 sprint_time, circuits(name, location, country)`)
        .eq('raceId', req.params.raceId);

    if (error) {
        return displayErrorParam(res, req.params.raceId);
    } else if (data.length < 1 || data == null) {
        return displayNoData(res, req.params.raceId);
    }

    res.send(data);
});

/**
 * Returns the data of all the races from a specified season (year) ordered by round
 */
app.get('/api/races/season/:year', async (req, res) => {
    const { data, error } = await supabase
        .from('races')
        .select()
        .eq('year', req.params.year)
        .order('round');

    if (error) {
        return displayErrorParam(res, req.params.year);
    } else if (data.length < 1 || data == null) {
        return displayNoData(res, req.params.year);
    }

    res.send(data);
});

/**
 * Returns the data of a race from a given season (year) specified by round
 */
app.get('/api/races/season/:year/:round', async (req, res) => {
    const { data, error } = await supabase
        .from('races')
        .select()
        .eq('year', req.params.year)
        .eq('round', req.params.round);

    if (error) {
        return displayErrorParam(res, req.params.year, req.params.round);
    } else if (data.length < 1 || data == null) {
        return displayNoData(res, req.params.year, req.params.round);
    }

    res.send(data);
});

/**
 * Returns the data of all the races for a specified circuit
 */
app.get('/api/races/circuits/:circuitRef', async (req, res) => {
    const { data, error } = await supabase
        .from('races')
        .select(`*, circuits!inner()`)
        .eq('circuits.circuitRef', req.params.circuitRef)
        .order('year');

    if (error) {
        return displayErrorParam(res, req.params.circuitRef);
    } else if (data.length < 1 || data == null) {
        return displayNoData(res, req.params.circuitRef);
    }

    res.send(data);
});

/**
 * Returns the data of all the races for a specified circuit between two years (inclusive)
 */
app.get('/api/races/circuits/:circuitRef/season/:yearStart/:yearEnd', async (req, res) => {
    const { data, error } = await supabase
        .from('races')
        .select(`*, circuits!inner()`)
        .eq('circuits.circuitRef', req.params.circuitRef)
        .gte('year', req.params.yearStart)
        .lte('year', req.params.yearEnd);

    if (req.params.yearStart > req.params.yearEnd) {
        res.send(jsonMessage(`Unable to fetch data due to parameter mismatch: Starting year ${req.params.yearStart} is earlier than ending year ${req.params.yearEnd}`));
        return;
    }

    if (error) {
        return displayErrorParam(res, req.params.circuitRef, req.params.yearStart, req.params.yearEnd);
    } else if (data.length < 1 || data == null) {
        return displayNoData(res, req.params.circuitRef, req.params.yearStart, req.params.yearEnd);
    }

    res.send(data);
});

/**
 * Returns all the data from the results table for a specified race ordered by grid
 */
app.get('/api/results/:raceId', async (req, res) => {
    const { data, error } = await supabase
        .from('results')
        .select(`resultId, number, grid, 
                 position, positionText, positionOrder, points, laps, time, milliseconds, 
                 fastestLap, rank, fastestLapTime, fastestLapSpeed, statusId, 
                 drivers(driverRef, code, forename, surname),
                 races(name, round, year, date),
                 constructors(name, constructorRef, nationality)`)
        .eq('raceId', req.params.raceId)
        .order('grid', { ascending: true });


    if (error) {
        return displayErrorParam(res, req.params.raceId);
    } else if (data.length < 1 || data == null) {
        return displayNoData(res, req.params.raceId);

    }

    res.send(data);
});

/**
 * Returns all the data from the results table for a specified driver
 */
app.get('/api/results/driver/:driverRef', async (req, res) => {
    const { data, error } = await supabase
        .from('results')
        .select(`*, drivers!inner()`)
        .eq('drivers.driverRef', req.params.driverRef);

    if (error) {
        return displayErrorParam(res, req.params.driverRef);
    } else if (data.length < 1 || data == null) {
        return displayNoData(res, req.params.driverRef);
    }

    res.send(data);
});

/**
 * Returns all the data from the results table for a specified driver between two years (inclusive) 
 */
app.get('/api/results/driver/:driverRef/seasons/:yearStart/:yearEnd', async (req, res) => {
    const { data, error } = await supabase
        .from('results')
        .select(`*, drivers!inner(), races!inner()`)
        .eq('drivers.driverRef', req.params.driverRef)
        .gte('races.year', req.params.yearStart)
        .lte('races.year', req.params.yearEnd);

    if (req.params.yearStart > req.params.yearEnd) {
        res.send(jsonMessage(`Unable to fetch data due to parameter mismatch: Starting year is earlier than Ending year`));
        return;
    }

    if (error) {
        return displayErrorParam(res, req.params.driverRef, req.params.yearStart, req.params.yearEnd);
    } else if (data.length < 1 || data == null) {
        return displayNoData(res, req.params.driverRef, req.params.yearStart, req.params.yearEnd);
    }

    res.send(data);
});

/**
 * Returns all the data from the qualifying table for a specified race ordered by position
 */
app.get('/api/qualifying/:raceId', async (req, res) => {
    const { data, error } = await supabase
        .from('qualifying')
        .select(`qualifyId, number, position, q1, q2, q3,
                 drivers(driverRef, code, forename, surname),
                 races(name, round, year, date),
                 constructors(name, constructorRef, nationality)`)
        .eq('raceId', req.params.raceId)
        .order('position', { ascending: true });

    if (error) {
        return displayErrorParam(res, req.params.raceId);

    } else if (data.length < 1 || data == null) {
        return displayNoData(res, req.params.raceId);

    }

    res.send(data);
});

/**
 * Returns all the driver standings data from a specified race ordered by position
 */
app.get('/api/standings/:raceId/drivers', async (req, res) => {
    const { data, error } = await supabase
        .from('driverStandings')
        .select(`driverStandingsId, raceId, points, position,
                 positionText, wins,
                 drivers(driverRef, code, forename, surname)`)
        .eq('raceId', req.params.raceId)
        .order('position', { ascending: true })

    if (error) {
        return displayErrorParam(res, req.params.raceId);

    } else if (data.length < 1 || data == null) {
        return displayNoData(res, req.params.raceId);

    }

    res.send(data);
});

/**
 * Returns all the constructor standings data from a specified race ordered by position
 */
app.get('/api/standings/:raceId/constructors', async (req, res) => {
    const { data, error } = await supabase
        .from('constructorStandings')
        .select(`constructorStandingsId, raceId, points, position,
                 positionText, wins,
                 constructors(name, constructorRef, nationality)`)
        .eq('raceId', req.params.raceId)
        .order('position', { ascending: true })

    if (error) {
        return displayErrorParam(res, req.params.raceId);

    } else if (data.length < 1 || data == null) {
        return displayNoData(res, req.params.raceId);

    }

    res.send(data);
});

app.listen(8080, () => {
    console.log('listening on port 8080');
    console.log('');
    console.log('Following links are for local testing');
    console.log('http://localhost:8080/api/seasons');
    console.log('');
    console.log('http://localhost:8080/api/circuits');
    console.log('http://localhost:8080/api/circuits/monza');
    console.log('http://localhost:8080/api/circuits/calgary');

    console.log('');
    console.log('http://localhost:8080/api/constructors');
    console.log('http://localhost:8080/api/constructors/ferrari');
    console.log('');
    console.log('http://localhost:8080/api/drivers');
    console.log('http://localhost:8080/api/drivers/Norris');
    console.log('http://localhost:8080/api/drivers/norris');
    console.log('http://localhost:8080/api/drivers/connolly');
    console.log('http://localhost:8080/api/drivers/search/sch');
    console.log('http://localhost:8080/api/drivers/search/xxxxx');
    console.log('http://localhost:8080/api/drivers/race/1069');
    console.log('');
    console.log('http://localhost:8080/api/races/1034');
    console.log('http://localhost:8080/api/races/season/2021');
    console.log('http://localhost:8080/api/races/season/2022/4');
    console.log('http://localhost:8080/api/races/circuits/monza');
    console.log('http://localhost:8080/api/races/circuits/monza/season/2015/2022');
    console.log('');
    console.log('http://localhost:8080/api/results/1106');
    console.log('http://localhost:8080/api/results/driver/max_verstappen');
    console.log('http://localhost:8080/api/results/driver/connolly');
    console.log('http://localhost:8080/api/results/driver/sainz/seasons/2021/2022');
    console.log('');
    console.log('http://localhost:8080/api/qualifying/1106');
    console.log('');
    console.log('http://localhost:8080/api/standings/1120/drivers');
    console.log('http://localhost:8080/api/standings/1120/constructors');
    console.log('http://localhost:8080/api/standings/asds/constructors');
}); 
