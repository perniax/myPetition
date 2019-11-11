// CLASS NOTES - PETITION PART 2
//
// colorhunt.co//
// flatuicolors.// COMBAK:
//
// unsplash.// COMBAK:
// fontawesome -- for icons
//
// google fonts
//
// petition --> signed (shows the signer own signature)
//             to now show that signature, we can set the ID on a cookie, and the call the signature from the db (the cookie could be hacked)
//
// to avoid hacked cookies.. we use COOKIE-SESSION


// const cp = require("cookie-parser");
// WE DONT USE COOKIE PARSER, INSTEAD WE'LL USE C-SESSION

const cookieSession = require('cookie-session');

app.use(cookieSession({
    secret: `I'm always angry.`,
    maxAge: 1000 * 60 * 60 * 24 * 14  //--- this refers to 2 weeks (14-> days)
}));

maxAge -- how long is going to store the cookies

the cookie session.sig--> the sec cookie but .sig is NOT related to the signature

get / --> redirect to petition, check first photo of 16/8


app.use(express.static("./public"));

app.get("/", (req, res) => {
    console.log('*************/ROUTE**********');
});


2nd foto (curry example), use it as conditional, if it there do this, if not, do that (16/8)

on db, we can also RETURNING id--- to read the table
[fname LL null, lname ll .. ]--> if it is undefined takes it as null

RETURNING we use it as bdquery


*****VULNERABILITIES******
JS
// eval--> converts a string into code, from there hackers can do whatever they want..

setTimeout-- the 1st argument instead of a fn could be a string, that becomes code,and then run it!

function constructor, has the same vulnerabilities..
HTML
XXS cros-site scripting attack, when is inserted on a input field a "<script src=........js></scrpt>",
when you show user content that comes from another user has to be SANITIED. In our case handlebars omits script tags (<,>, etc)

look for good library for Sanitazing

Clickjacking--> dont let your site to be on frames!
on JS where you have the routes,

// app.use(function(req, res, next) {
//     res.setHeader('X-Frame-Options', 'DENY');
//     next();
// }) ;


Check the references on the Spiced class page for HELMET, even if we dont downloaded is a good list of vulnerabilities



CSRF Attack!

if you are the bank(e.g), dont trust the cookie by itself, so use combination of the cookie and something thats proves that comes from your site,

app.use(function(req, res, next) {
    res.setHeader('X-Frame-Options', 'DENY');

    res.cookie('logged-in', 'true', {
        sameSite: true
    });

    next();
});

**for the petition, use cookieSession**

put into every dangerous request(post), set a secret or token (some unguessable string)

**check Protecting Against CSRF Class...

const cookieSession = require('cookie-session');
const csurf = require('csurf');

app.use(cookieSession({
    secret: `I'm always angry.`,
    maxAge: 1000 * 60 * 60 * 24 * 7 * 6
});

// look for email an then check what was the hash in order to compare, in this example we alredy have the hash..
// user_id has to be === id from the other table to keep track, and be able to follow
// user_id REFERENCES (users.id), <for me would be petition.id>  so is linked to the other table..

app.get("/", (req, res) => {
    hash("12345").then(hash => {
        console.log("hash: ", hash);
        //lets look at compare;
        compare("12345", hash)
            .then(match => {
                console.log("did my password match?");
                console.log(match);
            })
            .catch(e => console.log(e));
        //check what to render!!!
        res.redirect("/registration");
    });
});
______________


app.use(express.urlencoded({
    extended: false
});

app.use(csurf());

app.use(function(req, res, next) {
    res.setHeader('X-frame-options', 'deny');
    res.locals.csrfToken = req.csrfToken();
    next();
});

REMEMBER IN EVERY FORM SET THE _csrf ON EVERY FORM


***///20/08 CLASS****///
PART 4
after registration goes to more info (age, city, website) -- this are optionals--
then goes to signing the petitionHomes
then shows the signature, and there you can see all the signers,
next to the users you can see the name / city / link
if you goe to city e.g goes to petiton/signers/city and shows the signers from that ciy, and a message to go back
***be carefull with the URL cause we could be attaked

new table (no update) for the age/city/website, well end up with  tables (then we'll merge them)
(update a table takes time!! so makes sense to have a new one and the merge it)

TO MERGE THE TABLES:

have to be inside the same db,

the data is going to related with the id/singer_id

joins --> only recieves info (tables)/SELECT!
SELECT * FROM singers;
JOIN songs;
(now we say based on what join then)
ON singer_id = id; ---> NO!!! ;

SELECT * FROM singers
JOIN songs
ON singer_id = singers.id;

this table only exists while the query is happening, afer the query the joined table desapears
*we have two name columns, to fix this;
________________________________________________
now to rename;

SELECT singers.id AS "singer id", singers.name AS singer_name, songs.name AS song_name
(both works, with "" you could have capital letters)


FROM singers ;
JOIN songs;
ON singers.id = singers.id;
(gives back common info, songs without singer for instance are excluded)
**to show the signers, we start with signature table, and then start Joining info

________________________________________________
select:
SELECT singers.id AS "singer id", singers.name AS singer_name, songs.name AS song_name;
FROM singers;
FULL OUTER JOIN songs
ON singers.id = singer_id;
(shows a table with everything -row for song without singer, and singer without song)

________________________________________________

select:
SELECT singers.id AS "singer id", singers.name AS singer_name, songs.name AS song_name;
FROM singers;
LEFT JOIN songs
ON singers.id = singer_id;
(shows all the singers, but the song without singer didnt make it into the table)

________________________________________________
select:
SELECT singers.id AS "singer id", singers.name AS singer_name, songs.name AS song_name;
FROM singers;
RIGHT JOIN songs
ON singers.id = singer_id;
(shows all the songs, but the singers without song didnt make it into the table)

the we coud do somthing like,
WHERE singers.id =2;
___________________________________________
TRIPLE JOIN:

now there is another table, called albums,
(what you want to see goes on the SELECT)
SELECT singers.id, singers.name AS singer_name, songs.name AS songs_name, albums.name AS album_name;
FROM singers
LEFT JOIN songs
ON singers.ide = singer_id
(now we add the 3rd)
JOIN albums
ON songs.id = albums.song_id

to see the list of signers,
start from Signatures, and the start Joining

___________________________________________
**on sql,
user(id) --> the id from users table

**cleaning up the URL
check for the URL, st.startsWith("http") -- to check http or http:// or https://,
if the URL doesnt have http, we add it on front of the string (not all have https, even whn the should..)
(better to have an extra function for this, and then import it )

**on the signers, we dont show the URL, if the signer has one he name is a link

**to show the signers, well need looping handlebars {{#if url}} ...check spiced page for code,

**params-- name / city on the h1 of the handlebars

** also we could have, berlin, Berlin, BERLIN, so on our SQL query,
WHERE city =$1  ==>  WHERE LOWER(city) = LOWER($1)


____________________________

SUPER TEST

const supertest = require('supertest');
const app = require('./index.js');



test('Request to /home is successful', () => {
    return supertest(app).get('/home').then(res => {
        expect(res.statusCode).toBe(200);
        expect(res.headers['content-type']).toContain('text/html');
    });
});


    in the same level as index, we create index.test.js ,

    (.test.js is a requirement from Jest)

    in this file, const supertest = require('supertest');
    const {app} = require('./index');

1)    test('GET/ fome returns 200 status code', () => {
        return supertest(app).get('/home')
        //is promise based, so:
        .then(res => {
            console.log('res: ', res);
        });
    });

//*to run the test ==> npm test

properties to watch out:
statusCode'
headers
text

2) test('GET/ fome returns 200 status code', () => {
    return supertest(app).get('/home')
    //is promise based, so:
    .then(res => {
        expect(res.statusCode).toBe(200);
        //espect the variable to be tested, and toBe the desired value of that variable
    });
});
// we could now pass a ridiculous value on Tobe, and expect that it Fails, so we confirm that there is no problem with the Test itself,

    test('GET/ fome returns 200 status code', () => {
    return supertest(app).get('/home')
    //is promise based, so:
    .then(res => {
        expect(res.statusCode).toBe(4374739);
        //espect the variable to be tested, and toBe the desired value of that variable
    });
});

--detectOpenHandles -- to check async process that are still running,


// Jest turns the server on, but doesnt turn it off...  it runs everything including:
// app.listen(process.env.PORT || 8080, () => {
//     console.log("My express server is running");
// });

to avoid it,
(IN INDEX.JS!)
if (require.main==module) {
    app.listen(8080, () = console.log('Listening!'));
};
so only turns on the server index, and not Jest,
___________________________________________________




// now testing welcome, cause we dont have a cookie should how the message in home, so:

test('GET /welcome cause redirect', () = {
    return supertest(app).get('/welcome')
    .then(res => {
        expect(res.statusCode).toBe(302);
        expect(res.headers.location).toBe(/home);
    });
});

**headers -- location, to which route i was sent

cookie session mock

let tempSession, sessions = {};

//creates a fake cookie,
module.exports = () => (req, res, next) => {
    req.session = tempSession OR session;
    tempSession = null;
    next();
};

//Fake Cookies to be used on our Tests:
//persist for multiple tests that require cookies, we call it everytime that we want to recreate the cookie,
module.exports.mockSession = sess => session = sess;
//just to set the fake cooki once, is more explicit andgives more information;
module.exports.mockSessionOnce = sess => tempSession = sess;

// so, back on the test suite:
