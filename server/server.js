//dependency required
const express = require('express');
const bodyParser = require('body-parser');
const hbs = require('hbs');
var app = express();
const port = process.env.PORT || 3000;
const request = require('request');
const showdown = require('showdown');
var cors = require('cors')

const converter = new showdown.Converter();

var fs = require('fs');
var pdf = require('html-pdf');


let jsonsample = ` {
        "firstname": "Favour",
        "lastname": "Ori",
        "contact": {
            "email": "favourdemo@gmail.com",
            "phone": "(870) 949-0000",
            "website": "www.favourori.github.io",
            "linkedin": "linkedin.com/in/favourori/",
            "github": "github.com/orifavour"
        },
        "skills": {
            "details": [
                {
                    "type": "Programming Languages",
                    "items": [
                        "Java",
                        "Swift",
                        "Python",
                        "Javascript",
                        "PHP",
                        "Ruby",
                        "Rails"
                    ]
                },
                {
                    "type": "Web Frameworks",
                    "items": [
                        "Bootstrap",
                        "Materialize",
                        "Rails"
                    ]
                },
                {
                    "type": "Databases",
                    "items": [
                        "MySQL",
                        "SQLite"
                    ]
                },
                {
                    "type": "Tools",
                    "items": [
                        "Git",
                        "Sketch",
                        "Github",
                        "Craft by Invision",
                        "Andriod Studio",
                        "Xcode"
                    ]
                },
                {
                    "type": "Interests",
                    "items": [
                        "Software Development",
                        "Web Development",
                        "Machine Learning",
                        "Internet of Things"
                    ]
                }
            ]
        },
        "github_projects": {
            "items": [
                {
                    "project_name": "Bethel Church (App Backend)",
                    "tagline": "[iOS App Admin](https://github.com/orifavour/BethelChurchiOSAppBackend)",
                    "description": [
                        "Desktop App (developed in Java) for managing & controlling the content of Bethel's Mobile App"
                    ],
                    "technology_used": {
                        "tools": [
                            "Java",
                            "PHP",
                            "MySQL"
                        ]
                    }
                },
                {
                    "project_name": "SAU Honors College",
                    "tagline": "[iOS App ](https://github.com/orifavour/iOSHonorsCollege)",
                    "description": [
                        "iOS App designed for SAU Honors College  to improve the mobile experience of students, faculty, and friends of the college."
                    ],
                    "technology_used": {
                        "tools": [
                            "Swift",
                            "Xcode"
                        ]
                    }
                }
            ]
        },
        "other_projects": {
            "items": [
                {
                    "headline": "iOS App – Bethel Church, Magnolia",
                    "points": [
                        "Designed an iOS app for Bethel Church, to reduce printing of bulletins, and to let members have direct access to podcasts, upcoming events etc."
                    ],
                    "technology_used": {
                        "tools": [
                            "Swift",
                            "MySQL",
                            "PHP"
                        ]
                    }
                },
                {
                    "headline": "Course Selector – Computer Science Dept. SAU",
                    "points": [
                        "Web App for seamless course selection and registration"
                    ],
                    "technology_used": {
                        "tools": [
                            "HTML5",
                            "CSS3",
                            "PHP",
                            "MySQL"
                        ]
                    }
                }
            ]
        },
        "work_experience": {
            "items": [
                {
                    "title": "Software Developer",
                    "organisation": "Southern Arkansas University",
                    "location": "Magnolia, AR",
                    "from": "January 2017",
                    "to": "Present",
                    "details": [
                        "Working closely with my professors on various researches & projects"
                    ],
                    "technology_used": {
                        "tools": [
                            "Xcode",
                            "Swift",
                            "Java",
                            "HTML5",
                            "CSS3",
                            "PHP"
                        ]
                    }
                }
            ]
        },
        "involvement": {
            "organizations": [
                "Volunteer, Magnolia Blossom, OCT 2016"
            ]
        },
        "education": {
            "schools": [
                {
                    "degree": "Bachelor of Science",
                    "major": "Computer Science",
                    "institution": "Southern Arkansas University",
                    "graduation_year": 2020
                }
            ]
        },
        "research_experience": {
            "items": [
                {
                    "title": "Web Hacking",
                    "organisation": "National Collegiate Honors Council",
                    "from": "February 2017",
                    "to": "April 2017",
                    "points": [
                        "Implemented encryption methods (MD5 and SHA-1)to secure a previously unsecure Web App"
                    ]
                }
            ]
        }
    }
`;


//setting view engine 
app.set('view engine', 'hbs')


// middleware
app.use(cors())
app.use(bodyParser.json());
app.use(express.static(__dirname + "/../public"))



//Routes

app.get('/defaultsample', (req, res) => {
  res.json({
  	message: 'Fav Resume JSON Example Payload',
  	payload: jsonsample
  })
});

app.get('/', (req, res) => {
  res.render('app')
});


app.get('/home', (req, res) => {
  res.render('index')
});

app.get('/learn', (req, res) => {
  res.render('learn')
});

app.post('/generate', (req, res) => {
  var data = req.body
  //injecting request data to template string html
var webpage = `
<body class="boxed">
	<center>
		<h1>${data.firstname} ${data.lastname}</h1>
		<h4 class="light m-m-t-10" style="color:grey; padding-top:5px">
			${Object.keys(data.contact).map(function(key, index) { return ` 
			<span class="" >${data.contact[key]}</span>`;
}).join(' •')}
		</h4>
	</center>

	<hr class="thick">
	<h4 class="">TECHNICAL SKILLS</h4>
	<div class="offset-2">
		${data.skills.details.map( function(key) { return `
		<p>
			<strong>${key.type}:</strong> ${key.items.map(function (key) { return `${key}` }).join(', ')}` } ).join('</p>')}
		</div>
	<h4 class="">PERSONAL PROJECTS</h4>
	<div class="offset-2">


		${data.github_projects.items.map(function (key) { return `
		<p>
			<strong class="title">${key['project_name']} ${ converter.makeHtml(key['tagline']).replace(/<(\/)?p([^>]*)>/g, '') }
			</strong>
		</p>
		<div class="offset-2 p"> ${key['description'][0]} Technologies: ${key['technology_used'].tools.map(function (item){ return item}).join(', ') }
		</div> `}).join('')}


	</div>
	<h4 class="">OTHER PROJECTS</h4>

	${data.other_projects.items.map(function (key) { return `<div class="offset-2">
	<p>
		<strong class="title">${key['headline']}</strong>
	</p>
	<div class="offset-2 p"> ${key['points'][0]} Technologies: ${key['technology_used'].tools.map(function (item){ return item}).join(', ') }
	</div></div>`}).join('')}
	<h4 class="">PROFESSIONAL EXPERIENCE</h4>
	<div class="offset-2">
		<p>
			<strong class="title">${data.work_experience.items.map(function (key){ return `${key['title']}, ${key['organisation']}, ${key['location']}</b>
				<span class="pull-right">${key['from']} - ${key['to']}</span>
			</strong>
		</p>
		<div class="offset-2 p">${key['details'][0]} Technologies: ${key['technology_used'].tools.map(function (item){ return item}).join(', ') }
		</div>
	</div>` })}


	<h4 class="">INVOLVEMENTS</h4>
	<div class="">
		<ul class="boxed-list offset-2 p">
			${data.involvement.organizations.map(function (key){ return `
			<li class="offset-2" style="text-decoration-style:disc"> ${key} </li>` })}
		</ul>
	</div>
	<h4 class="">EDUCATION</h4>
	<div class="">
		<table cellpadding="10" style="width:100%">
			<thead>

				<tr>
					<th>Degree</th>
					<th>Major</th>
					<th>Institution</th>
					<th>graduation Year</th>
				</tr>
			</thead>
			<tbody>

				<tr>
					${data.education.schools.map(function (key){ return `
					<td>${key['degree']}</td>
					<td>${key['major']}</td>
					<td>${key['institution']}</td>
					<td>${key['graduation_year']}</td>

					` })}
				</tr>
			</tbody>


		</table>
	</div>
    <h4 class="">RESEARCH EXPERIENCE</h4>
    
    ${data.research_experience.items.map(function (key) {
        return `<div class="offset-2">
	<p>
		<strong class="title">${key['title']}- ${key['organisation']}</strong>
	</p>
	<div class="offset-2 p"> ${key['points'][0]}
    </div></div>`}).join('')}

</body>
`;



//setting options for PDF
  var options = { format: 'A4' };

  //Reads the Base Template from the Views Folder
  var template = hbs.compile(fs.readFileSync('././views/gen.hbs', 'utf8'));

  //Proccessing the base template with the content
  var html = template({content:webpage})

  var filename = `${data.firstname}${data.lastname}${new Date().toLocaleDateString()}`;
  //create PDF from the above generated html
  pdf.create(html, options).toFile(`./public/${filename}.pdf`, function (err, resp) {
   if(resp) return res.json({filename:filename+".pdf"})
    if (err) return console.log(err);
    console.log(res)
  });

});



//listen to voice of God
app.listen(port, () => {
  console.log(`Started up at port ${port}`);
});

module.exports = {
  app
};
