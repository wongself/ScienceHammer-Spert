# Science Hammer

## 环境配置
- Python 3.7
- Torch 1.6.0
- Django 3.1
- NLTK 3.5

## 如何在共用账户内更新项目
- 账号: sciencehammer
- 密码: sciencehammer
1. 进入文件夹`ScienceHammer`，使用`git pull`命令确保本地代码是最新的。
2. 按照`如何运行代码`章节来重新部署即可，确保网站端口正确。

## 如何运行代码
1. 将代码库原样下载到本地，或者登陆本项目的公用账号来查看文件夹`ScienceHammer`中的最新代码。
2. 进入文件夹`ScienceHammer`，运行以下代码来项目运行的必要文件`python manage.py migrate`。
3. 运行以下代码来开启网站并进行测试`python manage.py runserver 0.0.0.0:kkkk`，其中`kkkk`指的是指定端口号码。

## 代码说明
- 知识图谱展示代码请放在`sciencehammer/templates/graph.html`中`{% block page_panel %}`与紧跟的`{% endblock %}`之间。
- 点击识别按钮后，Python文件`sciencehammer/views.py`中的函数`xxxx_query`将分词处理后的词序列送入定义在文件夹`sciencehammer/application`中的识别函数`abcd.abcd_query`，并将得到的预测结果返回给页面。
- 目前的识别结果展示界面只能原样展示JSON格式的识别结果，后续将进行风格化工作。