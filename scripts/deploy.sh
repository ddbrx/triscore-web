#/bin/bash -e
GIT_COMMIT=`git rev-parse HEAD`
DATETIME=`date +%Y-%m-%d-%H-%M-%S`

SOURCE='dist/triscore-app/./'
DESTINATION='u1000367@37.140.192.78:/var/www/u1000367/data/triscore-versions/triscore-web-'$DATETIME'-'$GIT_COMMIT

echo ===> Builing prod version
ng build --prod

echo ===> Copy from $SOURCE to $DESTINATION
rsync -aR $SOURCE $DESTINATION
