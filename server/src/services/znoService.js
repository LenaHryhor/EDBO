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
        if(oldZno_id[0].zno_id != undefined)
        {
            throw new InvalidRequestError("Ця людина уже має сертифікат у цьому році")
        }
        const client = createConnection();
        
        const zno_id = await client.query(`SELECT zno_id FROM zno WHERE number = '${number}';`);
        if(zno_id.rows[0].zno_id != null){
            throw new InvalidRequestError("Номер цього сертифікату уже існує")
        }

        var arraySubjRes = new Array();
        var ar = subj_result.split('{');
        for(var i = 1; i < ar.length; i++)
        {
            var strSlice = ar[i].slice(0, ar[i].length-1);
            if(strSlice[strSlice.length - 1] == ','){
                strSlice = strSlice.slice(0, strSlice.length-1);
            }
            var str = '{' + strSlice;
            arraySubjRes.push(JSON.parse(str));
        } 
        
        let j = 0;
        while(j < 15)
        {
            if(j >= ar.length-1)
            {
                break;
            }
            var subject = arraySubjRes[j].subject;
            var result = arraySubjRes[j].result;
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

const updateOneYearZno = async(old_number, number, old_year, year, results) => {
    try {

        var arraySubjRes = new Array();
        var ar = results.split('{');
        for(var i = 1; i < ar.length; i++)
        {
            var strSlice = ar[i].slice(0, ar[i].length-1);
            if(strSlice[strSlice.length - 1] == ','){
                strSlice = strSlice.slice(0, strSlice.length-1);
            }
            var str = '{' + strSlice;
            arraySubjRes.push(JSON.parse(str));
        }

        const client = createConnection();
        let person =  await client.query(`SELECT person_fk FROM zno WHERE year = '${old_year}' AND number = '${old_number}';`);
        let person_id = person.rows[0].person_fk;
        await client.query(`DELETE FROM zno WHERE year = '${old_year}' AND number = '${old_number}' AND person_fk = '${person_id}';`);
        let res_insert = 0;
        let j = 0;
        while(j < 15)
        {
            if(j >= ar.length-1)
            {
                break;
            }
            var subject = arraySubjRes[j].subject;
            var result = arraySubjRes[j].result;
            if(subject != 'Не вибрано')
            {
                const subj_id = await client.query(`SELECT subject_id FROM subjects WHERE subject = '${subject}';`);
                res_insert = res_insert + await client.query(`INSERT into zno (number, person_fk, subject_fk, result, year) VALUES ('${number}', ${person_id}, '${subj_id.rows[0].subject_id}', '${result}',  '${year}');`)
            }
            j = j + 1;
        }

        client.end();
        return res_insert;
    } catch (err) {
        throw new SqlError(err.message)
    }
}

module.exports = {getOneYearZno, createOneYearZno, updateOneYearZno};