Informal list of techs that will be used to build this project:

# Development guide

### installing
You'll want to clone the project, `npm install`, and then `npm link`. `npm link` will link the "doplr" CLI tool to the cloned bin/doplr.js - so that you can test as a normal user would.
### coding style
All coding style decisions will be enforced via ESLINT. Make sure you install it in your editor!
### branching strategy
TODO

### Atom

If you're using the ATOM editor (well, any editor really, but i'm only going to provide a guide for atom), you'll want to install a few packages:

`apm install language-jade linter linter-eslint`

# High level:

### Dev Support:

  - Agile via Waffle: https://waffle.io/asdqwex/doplr
  - Community Chat via Gitter: https://gitter.im/asdqwex/doplr
  - Tests via CircleCI: https://circleci.com/gh/asdqwex/doplr
  - Coverage via Coveralls: https://coveralls.io/r/asdqwex/doplr
  - Dep checking via Gemnasium (TODO)
  - Developer site via GitHub pages: http://asdqwex.github.io/doplr/

### Language:

  - Strict-mode Javascript. On the server, we'll use io.js 2.0 and thus most of Es6/Es7
  - In the browser, we'll most likely end up with Babel, but will try to avoid needing that if possible.
  - eslint for linting

### Build system:

  - Gulp
  - webpack (for weathergirl)

### Libraries:

  - Floom
  - pm2 (for service control)
  - yargs (for CLI optstring processing)
  - levelDB (for storing forecast data)

### Test framework:

  - Mocha
  - Coveralls

### WeatherGirl:

  - d3.js (client)
  - ember.js (client)
  - koa (webserver)


# Design

## CLI & Daemon

### Radar & intraprocess communication

Doplr's --radar flag means that the CLI tool will need the ability to kick off jobs on the daemon. For this we'll use node's build in TCP server. By default we'll open a unix socket at `/tmp/doplr_radar.sock` but this should be configurable. You should easily be able to say `doplr scan --all --radar 4.4.4.4:9000` and have doplr CLI connect to a remote radar daemon over the net.

### Doplr API

Because the Doplr CLI _and_ WeatherGirl will have all the same access, we'll need a very strong /lib/doplr - in other words, Doplr CLI should only hit functionality that exists in lib, and WeatherGirls HTTP server should only wrap functions in the lib. We'll need to work hard to avoid duplication between these projects, which is one reason they're in the same repository.

### Floom

That said, Floom is part and parcel of this project. It is split apart because it is and should be totally independent. Floom is a library which allows easily scripting on and coordinating across multiple hosts via streams. It will need a huge amount of development to be where this project will need it to be. It should house all the cloud provider integration, as well as all the transport mechanisms - SSH, Fireball mode, etc.

The _only_ way Doplr should be able to access hosts directly is via Floom. This makes for a nice and clean seperation of concerns.

### Observation and data gathering

At the end of the day, doplr in its final form should more or less replace something like Graphite / Grafana. However, it is not our goal to re-invent all wheels - It's my thought that we should make as much use as possible of statsd. The doplr scan should be able to poll/pull data from statds on the local system.

Still, that's not the primary goal and will come later. The primary goal is not to collect _run time_ information like CPU usage or disk usage, etc, but rather to collect _metadata_ about what the system _is_. I'd imagine for quite a while all the data we'll collect is the hostname, address, and perhaps if its hosting a service on port 80 or not. All these sorts of collections and metadata generation will be shipped to plug-ins aggressively.

## WeatherGirl

WeatherGirl will need strong authentication support, among many many many many other things.
