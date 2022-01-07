const createConnection = require('../db');
const { SqlError, InvalidRequestError } = require('../utils/errors');
const { getOnePerson } = require('./personsService')

const getOneYearZno = async(year, number, name, surname, patronymic) => {
    try {
        const client = createConnection(year, number, name, surname, patronymic);
        const result = await client.query(`SELECT zno_id, result, subject FROM (SELECT * FROM zno WHERE person_fk in (SELECT person_id FROM persons ` +
            `WHERE name = '${name}' AND patronymic = '${patronymic}' AND  surname = '${surname}')` +
            `AND year = '${year}' AND number = '${number}') as f JOIN subjects ON subject_id = f.subject_fk;`);
        client.end();
        return result.rows;
    } catch (err) {
        throw new SqlError(err.message)
    }
}

const createOneYearZno = async(year, number, name, surname, patronymic, birth_date, p_series, p_number, authority_code, issue_date, subj_result) => {
    try {
        let person_id = await getOnePerson({ name, surname, p_series, p_number})
        if (!person_id) {
           throw new InvalidRequestError("Такої людини не існує")
        }

        let oldZno_id = await getOneYearZno (year, number, name, surname, patronymic);
        if(!oldZno_id)
        {
            throw new InvalidRequestError("Ця людина уже має сертифікат у цьому році")
        }

        var array = new Array();
        var ar = subj_result.split('{');
        for(var i = 1; i < ar.length; i++)
        {
            var strSlice = ar[i].slice(0, ar[i].length-1);
            if(strSlice[strSlice.length - 1] == ','){
                strSlice = strSlice.slice(0, strSlice.length-1);
            }
            var str = '{' + strSlice;
            array.push(JSON.parse(str));
        } 
        
        const client = createConnection();
        let j = 0;
        while(j < 15)
        {
            if(j >= ar.length-1)
            {
                break;
            }
            var subject = array[j].subject;
            var result = array[j].result;
            if(subject != 'Не вибрано')
            {
                const subj_id = await client.query(`SELECT subject_id FROM subjects WHERE subject = '${subject}';`);
                await client.query(`INSERT into zno (number, person_fk, subject_fk, result, year) VALUES ('${number}', ${person_id.person_id}, '${subj_id.rows[0].subject_id}', '${result}',  '${year}');`)
            }
            j = j + 1;
        }
        
        client.end();
    } catch (err) {
        throw new SqlError(err.message)
    }
}

const updateOneYearZno = async(year, number, name, surname, patronymic, resultOld, results) => {
    try {
        
        const client = createConnection();

        const person_id = await client.query(`SELECT person_id FROM persons` +
            `WHERE name = '${name}' AND patronymic = '${patronymic}' AND  surname = '${surname}'`);

        for(resString = 0; resString < results.lenght; resString++){

           // let subj_fk = await client.query(`SELECT subject_id FROM subjects WHERE subject = '${resultOld[resString].subject}'`);
           // const result = await client.query(`UPDATE zno SET number='${surname}', subject_fk = '${subj_fk}', 
           // result = '${}', year = '${}' WHERE zno_id = '1';`);
        }

        client.end();
        return result.rows;
    } catch (err) {
        throw new SqlError(err.message)
    }
}

module.exports = {getOneYearZno, createOneYearZno, updateOneYearZno};