# !/bin/bash
ls
pwd
cd /home/runner/work/cypress-testing/cypress-testing/glific
mix phx.server
cd ../
ls
pwd
yarn start http://glific.test:3000/