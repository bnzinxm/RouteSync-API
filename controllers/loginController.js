var helper = require('./../helpers/helpers');

module.exports.controller = (app, io, socket_list) => {

    const msg_success = "Sucesso!";
    const msg_fail = "Erro!";

    const carLocation_obj = {

    }

    app.post('/api/car_join', (req, res) => {
        helper.DLog(req.body);
        var reqObj = req.body;

        helper.CheckParameterValid( res, reqObj, ['uuid', 'lat', 'lon', 'degree', 'socket_id'], () => {

            socket_list['us_' + reqObj.uuid] = { 'socket_id': reqObj.socket_id}

            carLocation_obj[ reqObj.uuid ] = {
                'uuid' : reqObj.uuid, 'lat': parseFloat(reqObj.lat), 'lon': reqObj.lon, 'degree': reqObj.degree,
            }

            io.emit("car_join", {
                "status": "1",
                "payload": {
                    'uuid': reqObj.uuid, lat: reqObj.lat, 'long': reqObj.lon, 'degree': reqObj.degree
                }
            })

            res.json({ "status": "1", "payload": carLocation_obj, "message": msg_success });

        })
    })

    app.post('/api/car_update_location', (req, res) => {
        helper.DLog(req.body);
        var reqObj = req.body;

        helper.CheckParameterValid( res, reqObj, ['uuid', 'lat', 'lon', 'degree', 'socket_id'], () => {

            socket_list['us_' + reqObj.uuid] = { 'socket_id': reqObj.socket_id}

            carLocation_obj[ reqObj.uuid ] = {
                'uuid' : reqObj.uuid, 'lat': parseFloat(reqObj.lat), 'lon': reqObj.lon, 'degree': reqObj.degree,
            }

            io.emit("car_update_location", {
                "status": "1",
                "payload": {
                    'uuid': reqObj.uuid, lat: reqObj.lat, 'long': reqObj.lon, 'degree': reqObj.degree
                }
            })

            res.json({ "status": "1", "payload": carLocation_obj, "message": msg_success });

        })
    })
}