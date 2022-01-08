const { getOneTicket, createOneTicket, updateOneTicket } = require('../services/ticketsService')
const { InvalidRequestError } = require('../utils/errors')

const getTicket = async(req, res) => {
    const { type, series, number, name, surname, patronymic } = req.query;
    if (type == "Учнівський квиток") {
        type_int = 1
    } else {
        type_int = 0
    }
    const ticket = await getOneTicket(type_int, series, number, name, surname, patronymic);
    if (!ticket) {
        return res.status(400).json({ message: 'Немає записів з такими даними!' })
    }
    if (ticket.end_date > Date.now()) {
        ticket.status = "Активний"
    } else {
        ticket.status = "Неактивний"
    }
    ticket.type = type;
    ticket.surname = surname;
    ticket.name = name;
    ticket.patronymic = patronymic;
    res.status(200).json(ticket)
}

const createTicket = async(req, res) => {
    const { type, series, number, name, institution_name, surname, patronymic, start_date, end_date, p_series, p_number } = req.body;
    if (type == "Учнівський квиток") {
        type_int = 1
    } else {
        type_int = 0
    }
    try {
        await createOneTicket(type_int, series, number, name, institution_name, surname, patronymic, start_date, end_date, p_series, p_number)
        res.status(200).json({ message: "Ticket created successfully" })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

const updateTicket = async(req, res) => {
    const { student_ticket_id, type, series, number, institution_name, start_date, end_date } = req.body;
    if (type == "Учнівський квиток") {
        type_int = 1
    } else {
        type_int = 0
    }
    try {
        await updateOneTicket({ student_ticket_id, type_int, series, number, institution_name, start_date, end_date })
        res.status(200).json({ message: "Ticket updated successfully" })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

module.exports = { getTicket, createTicket, updateTicket };