projectName=saas_login_h5
npm install --registry=https://registrynpm.ys7.com/
npm run build
echo "delete ${projectName}"
rm -r ${projectName}
echo "mkdir ${projectName}"
mkdir ${projectName}
echo "mv files to ${projectName}"
mv ./build/*  ${projectName}
echo "zip to build.zip"
zip -r build.zip ${projectName}
echo "这里是打包文件的解压"