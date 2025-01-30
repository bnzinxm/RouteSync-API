var helper = require('./../helpers/helpers');

module.exports.controller = (app, io, socket_list) => {

    const msg_success = "Sucesso!";
    const msg_fail = "Erro!";

    io.on('connection', (client) => {
        client.on('UpdateSocket', (data) => {
            helper.DLog("UpdateSocket :- " + data);
            var jsonObj = JSON.parse(data);

            helper.CheckParameterValid(client, "UpdateSocket", jsonObj, ['uuid'], () => {
                socket_list['us_' + jsonObj.uuid] = { 'socket_id': client.id };

                helper.DLog(socket_list);
                client.emit( 'UpdateSocket', {'status': '1', 'message': msg_success});
            })
        })
    })
}