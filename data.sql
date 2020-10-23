\c biztime

DROP TABLE IF EXISTS invoices;
DROP TABLE IF EXISTS companies;
DROP TABLE IF EXISTS industries;
DROP TABLE IF EXISTS company_industry;


CREATE TABLE companies (
    code text PRIMARY KEY,
    name text NOT NULL UNIQUE,
    description text
);

CREATE TABLE invoices (
    id serial PRIMARY KEY,
    comp_code text NOT NULL REFERENCES companies ON DELETE CASCADE,
    amt float NOT NULL,
    paid boolean DEFAULT false NOT NULL,
    add_date date DEFAULT CURRENT_DATE NOT NULL,
    paid_date date,
    CONSTRAINT invoices_amt_check CHECK ((amt > (0)::double precision)) --this checks to make sure amt > 0;
);

CREATE TABLE industries (
  ind_code text PRIMARY KEY,
  industry text NOT NULL
);

CREATE TABLE company_industry (
  code text REFERENCES companies,
  ind_code text REFERENCES industries
);

INSERT INTO companies
  VALUES ('apple', 'Apple Computer', 'Maker of OSX.'),
         ('ibm', 'IBM', 'Big blue.');

INSERT INTO invoices (comp_Code, amt, paid, paid_date)
  VALUES ('apple', 100, false, null),
         ('apple', 200, false, null),
         ('apple', 300, true, '2018-01-01'),
         ('ibm', 400, false, null);

INSERT INTO industries
  VALUES ('$$$$', 'Money stuffs'),
         ('yum', 'Food Stuffs');

INSERT INTO company_industry
  VALUES ('apple', '$$$$'),
         ('apple', 'yum');

(`SELECT c.code, c.name, c.description, i.industry
FROM companies AS c
JOIN company_industry AS ci
ON c.code=ci.code
JOIN industries AS i
ON ci.ind_code=i.ind_code
WHERE c.code=$1`, [req.params.code])