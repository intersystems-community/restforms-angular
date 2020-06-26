import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';

export const USE_MOCK = false;

@Injectable({
    providedIn: 'root'
})
export class MockDataService {

    private endpointsData = new Map<string, object>();

    constructor() {
        const forms = [
            {name: 'Company', class: 'Form.Test.Company'},
            {name: 'Person', class: 'Form.Test.Person'},
            {name: 'Simple form', class: 'Form.Test.Simple'}
        ];

        const formTestSimpleInfo = {
            'name': 'Simple form',
            'class': 'Form.Test.Simple',
            'displayProperty': 'displayName',
            'objpermissions': 'CRUD',
            'fields': [{
                'name': 'displayName',
                'type': '%Library.String',
                'collection': '',
                'displayName': 'Text',
                'maxlen': '50',
                'required': 0,
                'category': 'datatype'
            }, {
                'name': 'text',
                'type': '%Library.String',
                'collection': '',
                'displayName': 'Text',
                'maxlen': '50',
                'required': 0,
                'category': 'datatype'
            }, {
                'name': 'IntegerList',
                'type': '%Library.Integer',
                'collection': 'list',
                'displayName': 'IntegerList',
                'maxlen': '',
                'required': 0,
                'category': 'datatype'
            }, {
                'name': 'IntegerArray',
                'type': '%Library.Integer',
                'collection': 'array',
                'displayName': 'IntegerArray',
                'maxlen': '',
                'required': 0,
                'category': 'datatype'
            }, {
                'name': 'ObjectList',
                'type': 'Form.Test.Person',
                'collection': 'list',
                'displayName': 'ObjectList',
                'maxlen': '',
                'required': 0,
                'category': 'form'
            }, {
                'name': 'ObjectArray',
                'type': 'Form.Test.Person',
                'collection': 'array',
                'displayName': 'ObjectArray',
                'maxlen': '',
                'required': 0,
                'category': 'form'
            }, {
                'name': 'Boolean',
                'type': '%Library.Boolean',
                'collection': '',
                'displayName': 'Boolean',
                'maxlen': '',
                'required': 0,
                'category': 'datatype'
            }, {
                'name': 'Integer',
                'type': '%Library.Integer',
                'collection': '',
                'displayName': 'Integer',
                'maxlen': '',
                'required': 0,
                'category': 'datatype'
            }, {
                'name': 'BigInt',
                'type': '%Library.BigInt',
                'collection': '',
                'displayName': 'BigInt',
                'maxlen': '',
                'required': 0,
                'category': 'datatype'
            }, {
                'name': 'SmallInt',
                'type': '%Library.SmallInt',
                'collection': '',
                'displayName': 'SmallInt',
                'maxlen': '',
                'required': 0,
                'category': 'datatype'
            }, {
                'name': 'TinyInt',
                'type': '%Library.TinyInt',
                'collection': '',
                'displayName': 'TinyInt',
                'maxlen': '',
                'required': 0,
                'category': 'datatype'
            }, {
                'name': 'Decimal',
                'type': '%Library.Decimal',
                'collection': '',
                'displayName': 'Decimal',
                'maxlen': '',
                'required': 0,
                'category': 'datatype'
            }, {
                'name': 'Double',
                'type': '%Library.Double',
                'collection': '',
                'displayName': 'Double',
                'maxlen': '',
                'required': 0,
                'category': 'datatype'
            }, {
                'name': 'Float',
                'type': '%Library.Float',
                'collection': '',
                'displayName': 'Float',
                'maxlen': '',
                'required': 0,
                'category': 'datatype'
            }, {
                'name': 'Currency',
                'type': '%Library.Currency',
                'collection': '',
                'displayName': 'Currency',
                'maxlen': '',
                'required': 0,
                'category': 'datatype'
            }, {
                'name': 'Numeric',
                'type': '%Library.Numeric',
                'collection': '',
                'displayName': 'Numeric',
                'maxlen': '',
                'required': 0,
                'category': 'datatype'
            }, {
                'name': 'String',
                'type': '%Library.String',
                'collection': '',
                'displayName': 'String',
                'maxlen': '50',
                'required': 0,
                'category': 'datatype'
            }, {
                'name': 'VarString',
                'type': '%Library.VarString',
                'collection': '',
                'displayName': 'VarString',
                'maxlen': '',
                'required': 0,
                'category': 'datatype'
            }, {
                'name': 'Char',
                'type': '%Library.Char',
                'collection': '',
                'displayName': 'Char',
                'maxlen': '50',
                'required': 0,
                'category': 'datatype'
            }, {
                'name': 'Date',
                'type': '%Library.Date',
                'collection': '',
                'displayName': 'Date',
                'maxlen': '',
                'required': 0,
                'category': 'datatype'
            }, {
                'name': 'DateTime',
                'type': '%Library.DateTime',
                'collection': '',
                'displayName': 'DateTime',
                'maxlen': '',
                'required': 0,
                'category': 'datatype'
            }, {
                'name': 'Time',
                'type': '%Library.Time',
                'collection': '',
                'displayName': 'Time',
                'maxlen': '',
                'required': 0,
                'category': 'datatype'
            }, {
                'name': 'TimeStamp',
                'type': '%Library.TimeStamp',
                'collection': '',
                'displayName': 'TimeStamp',
                'maxlen': '',
                'required': 0,
                'category': 'datatype'
            }, {
                'name': 'PosixTime',
                'type': '%Library.PosixTime',
                'collection': '',
                'displayName': 'PosixTime',
                'maxlen': '',
                'required': 0,
                'category': 'datatype'
            }]
        };

        const formTestSimpleObjects = {
            'children': [{'_id': '87', 'displayName': 'A6286'}, {
                '_id': '42',
                'displayName': 'A7221'
            }, {'_id': '26', 'displayName': 'A9352'}, {'_id': '3', 'displayName': 'A9625'}, {
                '_id': '99',
                'displayName': 'B1109'
            }, {'_id': '48', 'displayName': 'B1180'}, {'_id': '47', 'displayName': 'B1319'}, {
                '_id': '65',
                'displayName': 'B1596'
            }, {'_id': '16', 'displayName': 'B2217'}, {'_id': '56', 'displayName': 'B3096'}, {
                '_id': '25',
                'displayName': 'B3106'
            }, {'_id': '24', 'displayName': 'B42'}, {'_id': '73', 'displayName': 'B6934'}, {
                '_id': '13',
                'displayName': 'B7675'
            }, {'_id': '1', 'displayName': 'B9107'}, {'_id': '11', 'displayName': 'B9404'}, {
                '_id': '86',
                'displayName': 'C3802'
            }, {'_id': '14', 'displayName': 'C4706'}, {'_id': '67', 'displayName': 'C5363'}, {
                '_id': '44',
                'displayName': 'C6080'
            }, {'_id': '54', 'displayName': 'C6521'}, {'_id': '85', 'displayName': 'C6695'}, {
                '_id': '22',
                'displayName': 'C8919'
            }, {'_id': '9', 'displayName': 'D230'}, {'_id': '98', 'displayName': 'D7101'}], 'total': 100
        };

        const formTestSimple87 = {
            'displayName': 'A6286',
            'text': 'A6286',
            'IntegerList': [595864159, 144188432],
            'ObjectList': [{
                'name': 'Solomon,Mary Q.',
                'dob': '1950-11-04',
                'ts': '2020-06-15T09:13:11.432Z',
                'num': 2.15,
                'age': 69,
                'Home': {'House': 406, 'Street': '9492 Second Avenue', 'City': 'Jackson'},
                'company': '51',
                'company2': '27'
            }, {
                'name': 'Klingman,Olga L.',
                'dob': '1973-02-23',
                'ts': '2020-06-15T09:13:11.435Z',
                'num': 2.15,
                'age': 47,
                'Home': {'House': 366, 'Street': '5018 Second Blvd', 'City': 'Tampa'},
                'company': '82',
                'company2': '18'
            }, {
                'name': 'Quincy,Linda C.',
                'dob': '1932-10-25',
                'ts': '2020-06-15T09:13:11.436Z',
                'num': 2.15,
                'age': 87,
                'Home': {'House': 793, 'Street': '2940 Franklin Avenue', 'City': 'Boston'},
                'company': '10',
                'company2': '23'
            }, {
                'name': 'Tesla,Ashley I.',
                'dob': '1969-08-29',
                'ts': '2020-06-15T09:13:11.434Z',
                'num': 2.15,
                'age': 50,
                'Home': {'House': 98, 'Street': '3580 Oak Place', 'City': 'St Louis'},
                'company': '26',
                'company2': '86'
            }, {
                'name': 'Semmens,Lydia F.',
                'dob': '1992-02-22',
                'ts': '2020-06-15T09:13:11.438Z',
                'num': 2.15,
                'age': 28,
                'Home': {'House': 461, 'Street': '3234 Ash Street', 'City': 'Gansevoort'},
                'company': '94',
                'company2': '67'
            }],
            'ObjectArray': {
                'B891': {
                    'name': 'Lennon,Bart Y.',
                    'dob': '2009-07-26',
                    'ts': '2020-06-15T09:13:11.437Z',
                    'num': 2.15,
                    'age': 10,
                    'Home': {'House': 50, 'Street': '9405 Second Street', 'City': 'Youngstown'},
                    'company': '29',
                    'company2': '8'
                },
                'I965': {
                    'name': 'Ahmed,Brian T.',
                    'dob': '2007-06-20',
                    'ts': '2020-06-15T09:13:11.434Z',
                    'num': 2.15,
                    'age': 12,
                    'Home': {'House': 58, 'Street': '752 Second Court', 'City': 'Queensbury'},
                    'company': '63',
                    'company2': '36'
                },
                'N222': {
                    'name': 'Xerxes,Danielle Z.',
                    'dob': '2017-04-19',
                    'ts': '2020-06-15T09:13:11.436Z',
                    'num': 2.15,
                    'age': 3,
                    'Home': {'House': 246, 'Street': '6321 Main Place', 'City': 'Vail'},
                    'company': '87',
                    'company2': '48'
                },
                'T152': {
                    'name': 'Allen,Alvin S.',
                    'dob': '1957-05-31',
                    'ts': '2020-06-15T09:13:11.431Z',
                    'num': 2.15,
                    'age': 63,
                    'Home': {'House': 488, 'Street': '4445 Maple Drive', 'City': 'Fargo'},
                    'company': '79',
                    'company2': '72'
                },
                'U456': {
                    'name': 'McCormick,Kristen G.',
                    'dob': '1976-05-18',
                    'ts': '2020-06-15T09:13:11.437Z',
                    'num': 2.15,
                    'age': 44,
                    'Home': {'House': 799, 'Street': '3938 Clinton Blvd', 'City': 'Reston'},
                    'company': '58',
                    'company2': '93'
                },
                'U734': {
                    'name': 'Goldman,Julie X.',
                    'dob': '1989-01-22',
                    'ts': '2020-06-15T09:13:11.432Z',
                    'num': 2.15,
                    'age': 31,
                    'Home': {'House': 264, 'Street': '810 Washington Avenue', 'City': 'Tampa'},
                    'company': '10',
                    'company2': '22'
                },
                'V548': {
                    'name': 'Johnson,Stuart A.',
                    'dob': '1955-08-10',
                    'ts': '2020-06-15T09:13:11.436Z',
                    'num': 2.15,
                    'age': 64,
                    'Home': {'House': 637, 'Street': '9472 Second Place', 'City': 'Youngstown'},
                    'company': '78',
                    'company2': '13'
                },
                'Z926': {
                    'name': 'Koivu,Jane O.',
                    'dob': '1995-10-14',
                    'ts': '2020-06-15T09:13:11.433Z',
                    'num': 2.15,
                    'age': 24,
                    'Home': {'House': 4, 'Street': '6491 Oak Drive', 'City': 'Chicago'},
                    'company': '39',
                    'company2': '10'
                }
            },
            'Boolean': false,
            'Integer': 703894416,
            'BigInt': -17187571413777318,
            'SmallInt': 2049,
            'TinyInt': -27,
            'Decimal': 4149,
            'Double': 4156,
            'Float': 607,
            'Currency': 8161.2067,
            'Numeric': 5582.82,
            'String': 'L4395',
            'Date': '2006-10-04',
            'Time': '12:31:31Z',
            'TimeStamp': '1986-01-30T06:38:36Z',
            'PosixTime': -482385061.447451
        };

        const formTestPersonInfo = {
            'name': 'Person',
            'class': 'Form.Test.Person',
            'displayProperty': 'name',
            'objpermissions': 'CRUD',
            'fields': [{
                'name': 'name',
                'type': '%Library.String',
                'collection': '',
                'displayName': 'Name',
                'maxlen': '2000',
                'required': 0,
                'category': 'datatype'
            }, {
                'name': 'dob',
                'type': '%Library.Date',
                'collection': '',
                'displayName': 'Date of Birth',
                'maxlen': '',
                'required': 0,
                'category': 'datatype'
            }, {
                'name': 'ts',
                'type': '%Library.TimeStamp',
                'collection': '',
                'displayName': 'Timestamp',
                'maxlen': '',
                'required': 0,
                'category': 'datatype'
            }, {
                'name': 'num',
                'type': '%Library.Numeric',
                'collection': '',
                'displayName': 'Number',
                'maxlen': '',
                'required': 0,
                'category': 'datatype'
            }, {
                'name': 'age',
                'type': '%Library.Integer',
                'collection': '',
                'displayName': 'Age',
                'maxlen': '',
                'required': 0,
                'category': 'datatype'
            }, {
                'name': 'relative',
                'type': 'Form.Test.Person',
                'collection': '',
                'displayName': 'Relative',
                'maxlen': '',
                'required': 0,
                'category': 'form'
            }, {
                'name': 'Home',
                'type': 'Form.Test.Address',
                'collection': '',
                'displayName': 'House',
                'maxlen': '',
                'required': 0,
                'category': 'serial'
            }, {
                'name': 'company',
                'type': 'Form.Test.Company',
                'collection': '',
                'displayName': 'Company',
                'maxlen': '',
                'required': 0,
                'category': 'form'
            }, {
                'name': 'company2',
                'type': 'Form.Test.Company',
                'collection': '',
                'displayName': 'Company',
                'maxlen': '',
                'required': 0,
                'category': 'form'
            }]
        };

        const formTestPersonObjects = {
            'children': [{'_id': '1', 'displayName': 'Newton,Rhonda R.'}, {'_id': '77', 'displayName': 'Ott,Zeke T.'}, {
                '_id': '50',
                'displayName': 'Avery,Martin Y.'
            }, {'_id': '79', 'displayName': 'Isaksen,Susan I.'}, {'_id': '34', 'displayName': 'Xavier,Buzz E.'}, {
                '_id': '22',
                'displayName': 'Wilson,Edward G.'
            }, {'_id': '52', 'displayName': 'Koivu,Peter B.'}, {'_id': '72', 'displayName': 'Quincy,Linda C.'}, {
                '_id': '66',
                'displayName': 'Winters,Filomena X.'
            }, {'_id': '33', 'displayName': 'Underman,Olga N.'}, {'_id': '13', 'displayName': 'Djakovic,Ralph G.'}, {
                '_id': '28',
                'displayName': 'Williams,Bart M.'
            }, {'_id': '85', 'displayName': 'Koenig,John K.'}, {'_id': '40', 'displayName': 'Cooke,Emily K.'}, {
                '_id': '59',
                'displayName': 'Koivu,Roberta P.'
            }, {'_id': '81', 'displayName': 'West,Phil N.'}, {'_id': '12', 'displayName': 'Garcia,Edward B.'}, {
                '_id': '49',
                'displayName': 'Cheng,Christen O.'
            }, {'_id': '64', 'displayName': 'Zampitello,Lawrence E.'}, {'_id': '87', 'displayName': 'Eno,Agnes D.'}, {
                '_id': '88',
                'displayName': 'Smith,Josephine Y.'
            }, {'_id': '11', 'displayName': 'Orwell,Joshua Y.'}, {'_id': '10', 'displayName': 'Hertz,Imelda E.'}, {
                '_id': '62',
                'displayName': 'Zweifelhofer,Brenda L.'
            }, {'_id': '45', 'displayName': 'Quince,Pat B.'}], 'total': 100
        };

        const formTestPerson50 = {
            'name': 'Avery,Martin Y.',
            'dob': '1928-11-28',
            'ts': '2020-06-15T09:13:11.435Z',
            'num': 2.15,
            'age': 91,
            'Home': {'House': 453, 'Street': '6502 Oak Blvd', 'Company': {}, 'City': 'Newton'},
            'company': '64',
            'company2': '55'
        };

        const formTestCompanyInfo = {
            'name': 'Company',
            'class': 'Form.Test.Company',
            'displayProperty': 'name',
            'objpermissions': 'CRUD',
            'fields': [{
                'name': 'name',
                'type': '%Library.String',
                'collection': '',
                'displayName': 'Name',
                'maxlen': '50',
                'required': 0,
                'category': 'datatype'
            }, {
                'name': 'employees',
                'type': 'Form.Test.Person',
                'collection': 'array',
                'displayName': 'Employees',
                'maxlen': '',
                'required': 0,
                'category': 'form'
            }]
        };

        const formTestCompanyObjects = {
            'children': [{'_id': '36', 'displayName': 'AccuData Gmbh.'}, {'_id': '92', 'displayName': 'AccuData Gmbh.'}, {
                '_id': '66',
                'displayName': 'Accumo Gmbh.'
            }, {'_id': '29', 'displayName': 'AccuSoft Media Inc.'}, {'_id': '21', 'displayName': 'BioComp Associates'}, {
                '_id': '18',
                'displayName': 'BioData Gmbh.'
            }, {'_id': '20', 'displayName': 'BioNet Gmbh.'}, {'_id': '13', 'displayName': 'BioWare Inc.'}, {
                '_id': '63',
                'displayName': 'Compugy Group Ltd.'
            }, {'_id': '68', 'displayName': 'Compugy.com'}, {'_id': '88', 'displayName': 'CompuSoft Associates'}, {
                '_id': '77',
                'displayName': 'CompuSonics Inc.'
            }, {'_id': '41', 'displayName': 'CyberGlomerate Group Ltd.'}, {'_id': '48', 'displayName': 'CyberGlomerate LLC.'}, {
                '_id': '35',
                'displayName': 'DynaCalc LLC.'
            }, {'_id': '34', 'displayName': 'DynaComp Holdings Inc.'}, {'_id': '53', 'displayName': 'Dynagy Media Inc.'}, {
                '_id': '38',
                'displayName': 'DynaSoft Inc.'
            }, {'_id': '23', 'displayName': 'GigaNet Associates'}, {'_id': '75', 'displayName': 'GigaSoft Holdings Inc.'}, {
                '_id': '12',
                'displayName': 'GigaSys Corp.'
            }, {'_id': '91', 'displayName': 'GigaSystems Associates'}, {'_id': '90', 'displayName': 'GigaSystems Partners'}, {
                '_id': '60',
                'displayName': 'GlobaDynamics Corp.'
            }, {'_id': '45', 'displayName': 'Globamo Associates'}], 'total': 100
        };

        const formTestCompany36 = {'name': 'AccuData Gmbh.', 'employees': ['11', '40']};

        const formTestAddressInfo = {
            'name': '',
            'class': 'Form.Test.Address',
            'displayProperty': 'displayName',
            'objpermissions': 'CRUD',
            'fields': [{
                'name': 'House',
                'type': '%Library.Integer',
                'collection': '',
                'displayName': 'House',
                'maxlen': '',
                'required': 0,
                'category': 'datatype'
            }, {
                'name': 'Street',
                'type': '%Library.String',
                'collection': '',
                'displayName': 'Street',
                'maxlen': '80',
                'required': 0,
                'category': 'datatype'
            }, {
                'name': 'Company',
                'type': 'Form.Test.Company',
                'collection': '',
                'displayName': 'Company',
                'maxlen': '',
                'required': 0,
                'category': 'serial'
            },
                {
                'name': 'City',
                'type': '%Library.String',
                'collection': '',
                'displayName': 'City',
                'maxlen': '80',
                'required': 0,
                'category': 'datatype'
            }]
        };


        this.endpointsData.set('form/info', forms);

        this.endpointsData.set('form/info/Form.Test.Address', formTestAddressInfo);

        this.endpointsData.set('form/info/Form.Test.Company', formTestCompanyInfo);
        this.endpointsData.set('form/objects/Form.Test.Company/info', formTestCompanyObjects);
        this.endpointsData.set('form/object/Form.Test.Company/36', formTestCompany36);

        this.endpointsData.set('form/info/Form.Test.Person', formTestPersonInfo);
        this.endpointsData.set('form/objects/Form.Test.Person/info', formTestPersonObjects);
        this.endpointsData.set('form/object/Form.Test.Person/50', formTestPerson50);

        this.endpointsData.set('form/info/Form.Test.Simple', formTestSimpleInfo);
        this.endpointsData.set('form/objects/Form.Test.Simple/info', formTestSimpleObjects);
        this.endpointsData.set('form/object/Form.Test.Simple/87', formTestSimple87);
    }

    hasData(endpoint: string): boolean {
        return this.endpointsData.has(endpoint);
    }

    getData(endpoint: string): Observable<any> {
        return of(this.endpointsData.get(endpoint));
    }
}
