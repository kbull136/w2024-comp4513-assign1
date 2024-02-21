const express = require('express');
const supa = require('@supabase/supabase-js');
const app = express();

const jsonMessage = (msg) => {
    return { message: msg };
};

const supaUrl = 'https://tnhjiogbryszverqyefr.supabase.co';
const supaAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRuaGppb2dicnlzenZlcnF5ZWZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDcxODU4NzYsImV4cCI6MjAyMjc2MTg3Nn0._ALr_YGrUwbVXM7IQ6q9TB8oTWRqa-fTopd7q63w3F8';

const supabase = supa.createClient(supaUrl, supaAnonKey);

app.get('/api/seasons', async (req, res) => {
    const { data, error } = await supabase
        .from('seasons')
        .select();
    if (error) {
        res.send(jsonMessage(`Error fetching data: ${error}`));
        return;
    }

    res.send(data);
});

app.get('/api/circuits', async (req, res) => {
    const { data, error } = await supabase
        .from('circuits')
        .select();
    if (error) {
        res.send(jsonMessage(`Error fetching data: ${error}`));
        return;
    }

    res.send(data);
});

app.get('/api/circuits/:circuitRef', async (req, res) => {
    const { data, error } = await supabase
        .from('circuits')
        .select()
        .eq('circuitRef', req.params.circuitRef);

    if (data.length < 1 || data == null) {
        res.send(jsonMessage(`Query containing circuit reference: ${req.params.circuitRef} does not yield results`))
        return;
    } else if (error) {
        res.send(jsonMessage(`Error fetching data: ${error}`));
        return;
    }

    res.send(data);
});

app.get('/api/circuits/season/:year', async (req, res) => {
    const { data, error } = await supabase
        .from(`races`)
        .select(`round, circuits(*)`)
        .eq('year', req.params.year)
        .order('round', { ascending: true });

    if (data == null || data.length < 1) {
        res.send(jsonMessage(`Query containing year: ${req.params.year} does not yield results`))
        return;
    } else if (error) {
        res.send(jsonMessage(`Error fetching data: ${error}`));
        return;
    }
    res.send(data);
});

app.get('/api/constructors', async (req, res) => {
    const { data, error } = await supabase
        .from('constructors')
        .select();
    if (error) {
        res.send(jsonMessage(`Error fetching data: ${error}`));
        return;
    }

    res.send(data);
});

app.get('/api/constructors/:constructorRef', async (req, res) => {
    const { data, error } = await supabase
        .from('constructors')
        .select()
        .eq('constructorRef', req.params.constructorRef.toLowerCase());

    if (data == null || data.length < 1) {
        res.send(jsonMessage(`Query containing constructor reference: ${req.params.constructorRef} does not yield results`))
        return;
    } else if (error) {
        res.send(jsonMessage(`Error fetching data: ${error}`));
        return;
    }

    res.send(data);
});

app.get('/api/drivers', async (req, res) => {
    const { data, error } = await supabase
        .from('drivers')
        .select();

    if (error) {
        res.send(jsonMessage(`Error fetching data: ${error}`));
        return;
    }

    res.send(data);
});

app.get('/api/drivers/:driverRef', async (req, res) => {
    const { data, error } = await supabase
        .from('drivers')
        .select()
        .eq('driverRef', req.params.driverRef.toLowerCase());

    if (data == null || data.length < 1) {
        res.send(jsonMessage(`Query does not yield results containing driver reference: ${req.params.driverRef}`))
        return;
    } else if (error) {
        res.send(jsonMessage(`Error fetching data: ${error}`));
        return;
    }

    res.send(data);
});

app.get('/api/drivers/:substring', async (req, res) => {
    const { data, error } = await supabase
        .from('drivers')
        .select()
        .ilike('surname', `%${req.params.substring.toLowerCase()}`);

    if (data == null || data.length < 1) {
        res.send(jsonMessage(`Query does not yield results containing driver surname: ${req.params.substring} `))
        return;
    } else if (error) {
        res.send(jsonMessage(`Error fetching data: ${error}`));
        return;
    }

    res.send(data);
});

app.get('/api/drivers/race/:raceId', async (req, res) => {
    const { data, error } = await supabase
        .from('results')
        .select(`drivers(*)`)
        .eq('raceId', req.params.raceId);

    if (data == null || data.length < 1) {
        res.send(jsonMessage(`Query does not yield results of drivers containing raceId: ${req.params.raceId}`))
        return;
    } else if (error) {
        res.send(jsonMessage(`Error fetching data: ${error}`));
        return;
    }
    res.send(data);
});

app.get('/api/races/:raceId', async (req, res) => {
    const { data, error } = await supabase
        .from('races')
        .select(`raceId, year, round, name, date, time, url, fp1_date,
                 fp1_time, fp2_date, fp2_time,
                 fp3_date, fp3_time, quali_date,
                 quali_time, sprint_date,
                 sprint_time, circuits(name, location, country)`)
        .eq('raceId', req.params.raceId);

    if (data == null || data.length < 1) {
        res.send(jsonMessage(`Query does not yield results of races containing raceId: ${req.params.raceId}`))
        return;
    } else if (error) {
        res.send(jsonMessage(`Error fetching data: ${error}`));
        return;
    }

    res.send(data);
});

app.get('/api/races/season/:year', async (req, res) => {
    const { data, error } = await supabase
        .from('races')
        .select()
        .eq('year', req.params.year)
        .order('round');

    if (data == null || data.length < 1) {
        res.send(jsonMessage(`Query does not yield results of races with the year: ${req.params.year}`))
        return;
    } else if (error) {
        res.send(jsonMessage(`Error fetching data: ${error}`));
        return;
    }

    res.send(data);
});

app.get('/api/races/season/:year/:round', async (req, res) => {
    const { data, error } = await supabase
        .from('races')
        .select()
        .eq('year', req.params.year)
        .eq('round', req.params.round);

    if (data == null || data.length < 1) {
        res.send(jsonMessage(`Query does not yield results containing round: ${req.params.round} from season ${req.params.year}`))
        return;
    } else if (error) {
        res.send(jsonMessage(`Error fetching data: ${error}`));
        return;
    }

    res.send(data);
});

app.get('/api/races/circuits/:circuitRef', async (req, res) => {
    const { data, error } = await supabase
        .from('races')
        .select(`*, circuits!inner()`)
        .eq('circuits.circuitRef', req.params.circuitRef)
        .order('year');

    if (data == null || data.length < 1) {
        res.send(jsonMessage(`Query does not yield results containing circuitRef: ${req.params.circuitRef}`))
        return;
    } else if (error) {
        res.send(jsonMessage(`Error fetching data: ${error}`));
        return;
    }

    res.send(data);
});

app.get('/api/races/circuits/:circuitRef/season/:yearStart/:yearEnd', async (req, res) => {
    const { data, error } = await supabase
        .from('races')
        .select(`*, circuits!inner()`)
        .eq('circuits.circuitRef', req.params.circuitRef)
        .gte('year', req.params.yearStart)
        .lte('year', req.params.yearEnd);

    if (data == null || data.length < 1) {
        res.send(jsonMessage(`Query does not yield results containing circuitRef: ${req.params.circuitRef} between the seasons ${req.params.yearStart} and ${req.params.yearEnd}`))
        return;
    } else if (error) {
        res.send(jsonMessage(`Error fetching data: ${error}`));
        return;
    }

    res.send(data);
});

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

    if (data == null || data.length < 1) {
        res.send(jsonMessage(`Query does not yield results containing raceId: ${req.params.raceId}`))
        return;
    } else if (error) {
        res.send(jsonMessage(`Error fetching data: ${error}`));
        return;
    }

    res.send(data);
});

app.get('/api/results/driver/:driverRef', async (req, res) => {
    const { data, error } = await supabase
        .from('results')
        .select(`*, drivers!inner()`)
        .eq('drivers.driverRef', req.params.driverRef);

    if (data == null || data.length < 1) {
        res.send(jsonMessage(`Query does not yield results containing driverRef ${req.params.driverRef}`))
        return;
    } else if (error) {
        res.send(jsonMessage(`Error fetching data: ${error}`));
        return;
    }

    res.send(data);
});

app.get('/api/results/driver/:driverRef/seasons/:yearStart/:yearEnd', async (req, res) => {
    const { data, error } = await supabase
        .from('results')
        .select(`*, drivers!inner(), races!inner()`)
        .eq('drivers.driverRef', req.params.driverRef)
        .gte('races.year', req.params.yearStart)
        .lte('races.year', req.params.yearEnd);

    if (data == null || data.length < 1) {
        res.send(jsonMessage(`Query does not yield results containing driverRef: ${req.params.driverRef}, between seasons ${req.params.yearStart} and ${req.params.yearEnd}`));
        return;
    } else if (error) {
        res.send(jsonMessage(`Error fetching data: ${error}`));
        return;
    }

    res.send(data);
});

app.get('/api/qualifying/:raceId', async (req, res) => {
    const { data, error } = await supabase
        .from('qualifying')
        .select(`qualifyId, number, position, q1, q2, q3,
                 drivers(driverRef, code, forename, surname),
                 races(name, round, year, date),
                 constructors(name, constructorRef, nationality)`)
        .eq('raceId', req.params.raceId)
        .order('position', { ascending: true });

    if (data == null || data.length < 1) {
        res.send(jsonMessage(`Query does not yield results containing raceId: ${req.params.raceId}`))
        return;
    } else if (error) {
        res.send(jsonMessage(`Error fetching data: ${error}`));
        return;
    }

    res.send(data);
});

app.get('/api/standings/:raceId/drivers', async (req, res) => {
    const { data, error } = await supabase
        .from('driverStandings')
        .select(`driverStandingsId, raceId, points, position,
                 positionText, wins,
                 drivers(driverRef, code, forename, surname)`)
        .eq('raceId', req.params.raceId)
        .order('position', { ascending: true })

    if (data == null || data.length < 1) {
        res.send(jsonMessage(`Query does not yield results containing raceId: ${req.params.raceId}`))
        return;
    } else if (error) {
        res.send(jsonMessage(`Error fetching data: ${error}`));
        return;
    }

    res.send(data);
});

app.get('/api/standings/:raceId/constructors', async (req, res) => {
    const { data, error } = await supabase
        .from('constructorStandings')
        .select(`constructorStandingsId, raceId, points, position,
                 positionText, wins,
                 constructors(name, constructorRef, nationality)`)
        .eq('raceId', req.params.raceId)
        .order('position', { ascending: true })

    if (data == null || data.length < 1) {
        res.send(jsonMessage(`Query does not yield results containing raceId: ${req.params.raceId}`))
        return;
    } else if (error) {
        res.send(jsonMessage(`Error fetching data: ${error}`));
        return;
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
    console.log('http://localhost:8080/api/drivers');
    console.log('');
    console.log('Next two checks for case insensitivity')
    console.log('http://localhost:8080/api/drivers/Norris');
    console.log('http://localhost:8080/api/drivers/norris');
    console.log('http://localhost:8080/api/drivers/connolly');
    console.log('http://localhost:8080/api/drivers/search/sch');
    console.log('http://localhost:8080/api/drivers/search/xxxxx');
    console.log('http://localhost:8080/api/drivers/race/1069');
    console.log('');
    console.log('http://localhost:8080/api/races/1034');
    console.log('http://localhost:8080/api/races/season/2021');
    console.log('http://localhost:8080/api/races/season/2020/2022');
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