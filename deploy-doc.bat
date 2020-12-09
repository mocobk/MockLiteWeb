cd public\docs
git init
git add .
git commit -m "deploy"
git push -f git@github.com:mocobk/mocklite.git master:gh-pages
cd ..\..\
