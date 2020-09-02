# Science Hammer

## 环境配置
- Python 3.6+ (测试时为3.7.8)
- Torch 1.1.0+ (测试时为1.6.0)
- transformers 2.2.0+ (测试时为3.0.2)
- Django 3.1+ (测试时为3.1)
- NLTK 3.5+ (测试时为3.5)
- tqdm 4.19.0+ (测试时为4.48.2)
- scikit-learn 0.21.0+ (测试时为0.23.2)

建议直接输入以下的一系列指令来安装环境（因为我就是这么装的），前提是已经安装了MiniConda
1. `conda create -n py37 python=3.7`
2. `conda activate py37`
3. `pip install torch(==1.3.1) transformers django nltk tqdm scikit-learn`

## 如何在共用账户内更新项目
- 账号: sciencehammer
- 密码: sciencehammer
1. 进入文件夹`ScienceHammer`，使用`git pull`命令确保本地代码是最新的。
2. 按照`如何运行代码`章节来重新部署即可，确保网站端口不存在冲突。

## 如何运行代码（仅限V100服务器用户）
1. 在用户根目录输入`git clone git@github.com:wongself/ScienceHammer-Spert.git`将代码库原样下载到本地，~~或者登陆本项目的公用账号来查看文件夹`ScienceHammer`中的最新代码~~。
2. 进入文件夹`ScienceHammer-Spert`，输入`cp -r /data/wsf/ScienceHammer-Spert/data ./data`来拷贝网站运行所必需的模型数据文件吗，可能需要提前创建目标文件夹。
3. 位于文件夹`ScienceHammer-Spert`，输入以下命令来项目运行的必要文件`python manage.py migrate`。
4. 位于文件夹`ScienceHammer-Spert`，输入以下命令来开启网站并进行测试`python manage.py runserver 0.0.0.0:kkkk`，其中`kkkk`指的是指定端口号码，`0.0.0.0:`仅限本地电脑访问V100服务器上运行的网站时需要。

## 代码说明
- 实体、关系联合识别模型来自于Markus Eberts等人设计的[SpERT](https://github.com/markus-eberts/spert)模型。
- 目前的关系识别结果展示界面只能展示普通的关系三元组，后续将进行风格化工作。