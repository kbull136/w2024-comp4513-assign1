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
    const {data, error} = await supabase
        .from('seasons')
        .select()
    if (error) {
        console.error('Error fetching data:', error);
        return;
    }

    res.send(data);
});

app.get('/api/circuits', async (req, res) => {
    const {data, error} = await supabase
        .from('circuits')
        .select()
    if (error) {
        console.error('Error fetching data:', error);
        return;
    }

    res.send(data);
});

app.get('/api/circuits/:circuitRef', async (req, res) => {
    const {data, error} = await supabase
        .from('circuits')
        .select()
        .eq('circuitRef', req.params.circuitRef)

    if(data.length < 1 || data == undefined) {
        res.send(jsonMessage(`${req.params.circuitRef} does not exist on the database`))
        return;
    } else if(error) {
        console.error('Error fetching data:', error);
        return;
    }

    res.send(data);
});

app.get('/api/circuits/seasons/:year', async (req, res) => {
    const {data, error} = await supabase
        .from(`circuits`)
        .select()
        .join('races', 'circuitId')
        .join('seasons', 'year')
        .eq('year', req.params.year)
        .order('round', {ascending: true})

    if(data == null) {
        res.send(jsonMessage(`Query containing ${req.params.year} does not yield results`))
        return;
    } else if(error) {
        console.error('Error fetching data:', error);
        return;
    }

    res.send(data);
});

app.get('/api/constructors', async (req, res) => {
    const {data, error} = await supabase
        .from('constructors')
        .select()
    if (error) {
        console.error('Error fetching data:', error);
        return;
    }

    res.send(data);
});

app.get('/api/constructors/:constructorRef', async (req, res) => {
    const {data, error} = await supabase
        .from('constructors')
        .select()
        .eq('constructorRef', req.params.constructorRef)

    if(data.length < 1 || data == undefined) {
        res.send(jsonMessage(`${req.params.constructorRef} does not exist on the database`))
        return;
    } else if(error) {
        console.error('Error fetching data:', error);
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
    console.log('http://localhost:8080/api//api/constructors');
    console.log('http://localhost:8080/api/constructors/ferrari');
    console.log('http://localhost:8080/api/constructors/season/2020');
    console.log('http://localhost:8080/api/drivers');
    console.log('');
    console.log('Next two checks for case insensitivity')
    console.log('http://localhost:8080/api/drivers/Norris');
    console.log('http://localhost:8080/api/drivers/norris');
    console.log('http://localhost:8080/api/drivers/connolly');
    console.log('http://localhost:8080/api/drivers/search/sch');
    console.log('http://localhost:8080/api/drivers/search/xxxxx');
    console.log('http://localhost:8080/api/drivers/season/2022');
    console.log('http://localhost:8080/api/drivers/race/1069');
    console.log('');
    console.log('http://localhost:8080/api/races/1034');
    console.log('http://localhost:8080/api/races/season/2021');
    console.log('http://localhost:8080/api/races/season/2020/2022');
    console.log('http://localhost:8080/api/races/season/2022/2020');
    console.log('http://localhost:8080/api/races/circuits/7');
    console.log('http://localhost:8080/api/races/circuits/7/season/2015/2022');
    console.log('');
    console.log('http://localhost:8080/api/results/1106');
    console.log('http://localhost:8080/api/results/driver/max_verstappen');
    console.log('http://localhost:8080/api/results/driver/connolly');
    console.log('http://localhost:8080/api/results/drivers/sainz/seasons/2021/2022');
    console.log('');
    console.log('http://localhost:8080/api/qualifying/1106');
    console.log('');
    console.log('http://localhost:8080/api/standings/drivers/1120');
    console.log('http://localhost:8080/api/standings/constructors/1120');
    console.log('http://localhost:8080/api/standings/construtors/asds');
});