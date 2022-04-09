exports.sendJsonXml = (obj, req, res) => {
    if (req.accepts('json') || req.accepts('text/html')) {
        res.header('Content-Type', 'application/json');
        res.send(obj);
    } else
        if (req.accepts('application/xml')) {
            res.header('Content-Type', 'text/xml');
            const xmlOptions = {
                header: true,
                indent: '   '
            };
            let parsedResponse = { response: JSON.parse(obj) };
            var xml = toXML(parsedResponse, xmlOptions);
            res.send(xml);
        } else {
            res.send(406);
        }
};