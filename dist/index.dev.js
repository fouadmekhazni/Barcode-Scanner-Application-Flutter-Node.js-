"use strict";

var express = require('express');

var bodyParser = require('body-parser');

var sql = require("msnodesqlv8");

var axios = require('axios');

var app = express();
var PORT = process.env.PORT || 2000;
app.use(bodyParser.json());
var connectionString = "driver={SQL Server}; APP=msnodesqlv8; Server=192.168.1.5; Database={TCHINLAIT-WMS 24-12}; Trusted_Connection=Yes";

var connectToSqlServer = function connectToSqlServer() {
  return regeneratorRuntime.async(function connectToSqlServer$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(sql.connect(connectionString));

        case 3:
          console.log("Connected to SQL Server");
          _context.next = 9;
          break;

        case 6:
          _context.prev = 6;
          _context.t0 = _context["catch"](0);
          console.error('Error connecting to SQL Server:', _context.t0.message);

        case 9:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 6]]);
};

connectToSqlServer();
app.post('/api/locations/save', function _callee(req, res) {
  var _req$body, LocationID, code, designation1, designation2, query;

  return regeneratorRuntime.async(function _callee$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _req$body = req.body, LocationID = _req$body.LocationID, code = _req$body.code, designation1 = _req$body.designation1, designation2 = _req$body.designation2;
          _context2.prev = 1;
          query = "INSERT INTO [TCHINLAIT-WMS 24-12].[TCHIN-LAIT\\fouad.mekhazni].[locations] (code, Designation1, Designation2) \n                       VALUES ('".concat(code, "', '").concat(designation1, "','").concat(designation2, "')");
          _context2.next = 5;
          return regeneratorRuntime.awrap(sql.query(connectionString, query));

        case 5:
          console.log("Location saved successfully,", code, designation1, designation2);
          res.json({
            message: 'Location saved successfully'
          });
          _context2.next = 13;
          break;

        case 9:
          _context2.prev = 9;
          _context2.t0 = _context2["catch"](1);
          console.error('Error saving location:', _context2.t0.message);
          res.status(500).json({
            error: 'Error saving location'
          });

        case 13:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[1, 9]]);
});
app.put('/api/locations/update', function _callee2(req, res) {
  var _req$body2, code, designation1, designation2, query;

  return regeneratorRuntime.async(function _callee2$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _req$body2 = req.body, code = _req$body2.code, designation1 = _req$body2.designation1, designation2 = _req$body2.designation2;
          _context3.prev = 1;
          query = "UPDATE [TCHINLAIT-WMS 24-12].[TCHIN-LAIT\\fouad.mekhazni].[locations] \n                       SET Designation1 = '".concat(designation1, "', Designation2 = '").concat(designation2, "'\n                       WHERE code = '").concat(code, "'");
          _context3.next = 5;
          return regeneratorRuntime.awrap(sql.query(connectionString, query));

        case 5:
          console.log("Location updated successfully,", code, designation1, designation2);
          res.json({
            message: 'Location updated successfully'
          });
          _context3.next = 13;
          break;

        case 9:
          _context3.prev = 9;
          _context3.t0 = _context3["catch"](1);
          console.error('Error updating location:', _context3.t0.message);
          res.status(500).json({
            error: 'Error updating location'
          });

        case 13:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[1, 9]]);
});
app["delete"]('/api/locations/delete/:code', function _callee3(req, res) {
  var code, query;
  return regeneratorRuntime.async(function _callee3$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          code = req.params.code;
          _context4.prev = 1;
          query = "DELETE FROM [TCHINLAIT-WMS 24-12].[TCHIN-LAIT\\fouad.mekhazni].[locations] \n                       WHERE code = '".concat(code, "'");
          _context4.next = 5;
          return regeneratorRuntime.awrap(sql.query(connectionString, query));

        case 5:
          console.log("Location deleted successfully,", code);
          res.json({
            message: 'Location deleted successfully'
          });
          _context4.next = 13;
          break;

        case 9:
          _context4.prev = 9;
          _context4.t0 = _context4["catch"](1);
          console.error('Error deleting location:', _context4.t0.message);
          res.status(500).json({
            error: 'Error deleting location'
          });

        case 13:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[1, 9]]);
});
app.post('/api/immobilisations/save', function _callee4(req, res) {
  var _req$body3, code, designation1, designation2, locationID, query;

  return regeneratorRuntime.async(function _callee4$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _req$body3 = req.body, code = _req$body3.code, designation1 = _req$body3.designation1, designation2 = _req$body3.designation2, locationID = _req$body3.locationID;
          _context5.prev = 1;
          query = "INSERT INTO [TCHINLAIT-WMS 24-12].[TCHIN-LAIT\\fouad.mekhazni].[Immobilisations] (Code, Designation1, Designation2, LocationID) \n                       VALUES ('".concat(code, "', '").concat(designation1, "', '").concat(designation2, "')");
          _context5.next = 5;
          return regeneratorRuntime.awrap(sql.query(connectionString, query));

        case 5:
          console.log("Immobilisation saved successfully,", code, designation1, designation2);
          res.json({
            message: 'Immobilisation saved successfully'
          });
          _context5.next = 13;
          break;

        case 9:
          _context5.prev = 9;
          _context5.t0 = _context5["catch"](1);
          console.error('Error saving immobilisation:', _context5.t0.message);
          res.status(500).json({
            error: 'Error saving immobilisation'
          });

        case 13:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[1, 9]]);
});
app.put('/api/immobilisations/update', function _callee5(req, res) {
  var _req$body4, code, designation1, designation2, locationID, query;

  return regeneratorRuntime.async(function _callee5$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _req$body4 = req.body, code = _req$body4.code, designation1 = _req$body4.designation1, designation2 = _req$body4.designation2, locationID = _req$body4.locationID;
          _context6.prev = 1;
          query = "UPDATE [TCHINLAIT-WMS 24-12].[TCHIN-LAIT\\fouad.mekhazni].[Immobilisations] \n                       SET Designation1 = '".concat(designation1, "', Designation2 = '").concat(designation2, "', LocationID = '").concat(locationID, "'\n                       WHERE Code = '").concat(code, "'");
          _context6.next = 5;
          return regeneratorRuntime.awrap(sql.query(connectionString, query));

        case 5:
          console.log("Immobilisation updated successfully,", code, designation1, designation2, locationID);
          res.json({
            message: 'Immobilisation updated successfully'
          });
          _context6.next = 13;
          break;

        case 9:
          _context6.prev = 9;
          _context6.t0 = _context6["catch"](1);
          console.error('Error updating immobilisation:', _context6.t0.message);
          res.status(500).json({
            error: 'Error updating immobilisation'
          });

        case 13:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[1, 9]]);
});
app["delete"]('/api/immobilisations/delete/:code', function _callee6(req, res) {
  var code, query;
  return regeneratorRuntime.async(function _callee6$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          code = req.params.code;
          _context7.prev = 1;
          query = "DELETE FROM [TCHINLAIT-WMS 24-12].[TCHIN-LAIT\\fouad.mekhazni].[Immobilisations] \n                       WHERE Code = '".concat(code, "'");
          _context7.next = 5;
          return regeneratorRuntime.awrap(sql.query(connectionString, query));

        case 5:
          console.log("Immobilisation deleted successfully,", code);
          res.json({
            message: 'Immobilisation deleted successfully'
          });
          _context7.next = 13;
          break;

        case 9:
          _context7.prev = 9;
          _context7.t0 = _context7["catch"](1);
          console.error('Error deleting immobilisation:', _context7.t0.message);
          res.status(500).json({
            error: 'Error deleting immobilisation'
          });

        case 13:
        case "end":
          return _context7.stop();
      }
    }
  }, null, null, [[1, 9]]);
});
app.get('/api/immobilisations', function _callee7(req, res) {
  var query, result;
  return regeneratorRuntime.async(function _callee7$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          _context8.prev = 0;
          query = "SELECT * FROM [TCHINLAIT-WMS 24-12].[TCHIN-LAIT\\fouad.mekhazni].[Immobilisations]";
          _context8.next = 4;
          return regeneratorRuntime.awrap(sql.query(connectionString, query));

        case 4:
          result = _context8.sent;
          console.log("Immobilisations fetched successfully");
          res.json(result);
          _context8.next = 13;
          break;

        case 9:
          _context8.prev = 9;
          _context8.t0 = _context8["catch"](0);
          console.error('Error fetching immobilisations:', _context8.t0.message);
          res.status(500).json({
            error: 'Error fetching immobilisations'
          });

        case 13:
        case "end":
          return _context8.stop();
      }
    }
  }, null, null, [[0, 9]]);
});
app.get('/api/locations', function _callee8(req, res) {
  var query, result;
  return regeneratorRuntime.async(function _callee8$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          _context9.prev = 0;
          query = "SELECT * FROM [TCHINLAIT-WMS 24-12].[TCHIN-LAIT\\fouad.mekhazni].[locations]";
          _context9.next = 4;
          return regeneratorRuntime.awrap(sql.query(connectionString, query));

        case 4:
          result = _context9.sent;
          console.log("Locations retrieved successfully");
          res.json(result);
          _context9.next = 13;
          break;

        case 9:
          _context9.prev = 9;
          _context9.t0 = _context9["catch"](0);
          console.error('Error retrieving locations:', _context9.t0.message);
          res.status(500).json({
            error: 'Error retrieving locations'
          });

        case 13:
        case "end":
          return _context9.stop();
      }
    }
  }, null, null, [[0, 9]]);
});
app.listen(PORT, function () {
  console.log("Server is running on port ".concat(PORT));
});