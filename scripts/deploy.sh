#/bin/bash -e
SOURCE='dist/triscore-app/./'

GIT_COMMIT=`git rev-parse HEAD`
DATE=`date +%Y%m%d`
TIME=`date +%H-%M-%S`

DESTINATION_USER='triscore'
DESTINATION_SERVER='triscore-regru'
DESTINATION_ROOT='/var/www/triscore.me/versions'
DESTINATION_SUFFIX=$DATE"_"$TIME"_"$GIT_COMMIT
DESTINATION=$DESTINATION_USER"@"$DESTINATION_SERVER:$DESTINATION_ROOT/$DESTINATION_SUFFIX


echo "===> Building prod version"
ng build --prod

echo "===> Copy from $SOURCE to $DESTINATION"
rsync -aR $SOURCE $DESTINATION
