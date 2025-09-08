var DataTypes = require("sequelize").DataTypes;
var _Categories = require("./categories");
var _Priorities = require("./priorities");
var _Statuses = require("./statuses");
var _TicketComments = require("./ticketComments");
var _Tickets = require("./tickets");
var _Users = require("./users");

function initModels(sequelize) {
  var Categories = _Categories(sequelize, DataTypes);
  var Priorities = _Priorities(sequelize, DataTypes);
  var Statuses = _Statuses(sequelize, DataTypes);
  var TicketComments = _TicketComments(sequelize, DataTypes);
  var Tickets = _Tickets(sequelize, DataTypes);
  var Users = _Users(sequelize, DataTypes);

  // Categoría del ticket
  Tickets.belongsTo(Categories, { as: "category", foreignKey: "category_id" });
  Categories.hasMany(Tickets, { as: "tickets", foreignKey: "category_id" });

  // Prioridad del ticket
  Tickets.belongsTo(Priorities, { as: "priority", foreignKey: "priority_id" });
  Priorities.hasMany(Tickets, { as: "tickets", foreignKey: "priority_id" });

  // Estado del ticket
  Tickets.belongsTo(Statuses, { as: "status", foreignKey: "status_id" });
  Statuses.hasMany(Tickets, { as: "tickets", foreignKey: "status_id" });

  // Comentarios asociados al ticket
  TicketComments.belongsTo(Tickets, { as: "ticket", foreignKey: "ticket_id" });
  Tickets.hasMany(TicketComments, { as: "ticket_comments", foreignKey: "ticket_id" });

  // Usuario que comenta
  TicketComments.belongsTo(Users, { as: "comment_user", foreignKey: "user_id" });
  Users.hasMany(TicketComments, { as: "user_comments", foreignKey: "user_id" });

  // Usuario que crea el ticket (cliente)
  Tickets.belongsTo(Users, { as: "creator", foreignKey: "user_id" });
  Users.hasMany(Tickets, { as: "created_tickets", foreignKey: "user_id" });

  // Usuario asignado al ticket (agente)
  Tickets.belongsTo(Users, { as: "assignee", foreignKey: "assigned_to" });
  Users.hasMany(Tickets, { as: "assigned_tickets", foreignKey: "assigned_to" });

  return {
    Categories,
    Priorities,
    Statuses,
    TicketComments,
    Tickets,
    Users,
  };
}

module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;