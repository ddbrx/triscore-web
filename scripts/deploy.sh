#/bin/bash -e
GIT_COMMIT=`git rev-parse HEAD`
DATETIME=`date +%Y-%m-%d-%H-%M-%S`

SOURCE='dist/triscore-app/./'
DESTINATION='triscore-www@triscore-xen-regru:/var/www/triscore-www/data/available/triscore.me/'$DATETIME'-'$GIT_COMMIT

echo "===> Building prod version"
# ng build --prod

echo "===> Copy from $SOURCE to $DESTINATION"
rsync -aR $SOURCE $DESTINATION
