import * as express from 'express'
import * as hue from './lib/hue'
import * as wemo from './lib/wemo'
import * as bedroom from './automation/bedroom'
import * as control from './automation/control'

const app = express()
const port = 3000

hue.discover()
    .then(() => console.log('Hue discovery complete'))
    .catch(err => process.exit(err))

wemo.discover()
    .then(() => console.log('Wemo discovery complete'))
    .catch(err => process.exit(err))

app.get('/bedtime', (req, res) => 
    bedroom.goodnight().then(x => res.send(x)))

app.get('/wakeup', (req, res) => 
    bedroom.wakeup().then(x => res.send(x)))

app.get('/lights', (req, resp) => 
    control.getLights().then(x => resp.send(x)))

app.get('/lights/:name', (req, res) => {
    control.enableLights(req.params.name, req.query.state)
        .then(() => res.send(`${req.params.name} is now ${req.query.state}`))
        .catch(err => res.status(500).send({error: err.message}))
})

app.listen(port, () => console.log(`server listening on port ${port}`))

