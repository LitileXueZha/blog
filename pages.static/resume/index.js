import React from 'react';
import ReactDOM from 'react-dom';
import data from './data.js';

import './index.less';

// 头部组件
class HeaderComponent extends React.Component {
  render() {
    const { name, role, location } = this.props;
    return (
      <header className="resume-header">
        <img src="https://tao-1252397519.cos.ap-shanghai.myqcloud.com/%E5%A4%B4%E5%83%8F2.0%E2%80%94%E2%80%94%E5%B0%8F.png" alt="头像" />
        <div className="resume-header-content">
          <h2 className="title">{name}</h2>
          <p className="role">{role}</p>
          <span className="location">{location}</span>
        </div>
      </header>
    );
  }
}

//  个人简介
class ProfileComponent extends React.Component {
  render() {
    return (
      <figure className="item">
        <figcaption className="item-title">{this.props.title}</figcaption>
        <div className="item-content">{this.props.profile}</div>
      </figure>
    );
  }
}

//  工作经历
class ExperienceComponent extends React.Component {
  render() {
    return (
      <figure className="item">
        <figcaption className="item-title">{this.props.title}</figcaption>
        <div className="item-content">
          { this.props.experience.map(x => (
            <div key={x.name} className="item-exp">
              <strong className="item-exp-name">{x.name}</strong>
              <time className="item-exp-time">{x.time}</time>
              <p className="item-exp-content">{x.content}</p>
            </div>
          )) }
        </div>
      </figure>
    );
  }
}

//  教育经历
class EducationComponent extends React.Component {
  render() {
    return (
      <figure className="item">
        <figcaption className="item-title">{this.props.title}</figcaption>
        <div className="item-content">
        { this.props.education.map(x => (
          <div key={x.name} className="item-exp">
            <strong className="item-exp-name">{x.name}</strong>
            <time className="item-exp-time">{x.time}</time>
            { x.content.map(y => <p className="item-exp-content" key={y}>{y}</p>) }
          </div>
        )) }
        </div>
      </figure>
    );
  }
}

//  详细信息
class DetailComponent extends React.Component {
  render() {
    const { title, details, detailsKey, commonDetails } = this.props;
    const arr = [...commonDetails];
    arr.splice(1, 0, details);
    return (
      <section className="item-right">
        <strong className="item-right-title">{this.props.title}</strong>
        { arr.map((x, i) => <p className="item-right-p" key={x}><span className="item-right-p-label">{detailsKey[i]}</span>{x}</p>) }
      </section>
    );
  }
}

//  进度条
class Progress extends React.Component {
  render() {
    return (
      <div className="progress-container">
        <span className="progress-text">{this.props.text}</span>
        <div className="progress-total"><div className="progress-value" style={{ width: `${this.props.value}%` }} /></div>
      </div>
    );
  }
}

//  专业技能
class ExpertiseComponent extends React.Component {
  render() {
    return (
      <section className="item-right">
        <strong className="item-right-title">{this.props.title}</strong>
        { this.props.expertise.map(x => <Progress key={x[0]} text={x[0]} value={x[1]} />) }
      </section>
    );
  }
}

//  爱好
class HobbyComponent extends React.Component {
  render() {
    return (
      <section className="item-right">
        <strong className="item-right-title">{this.props.title}</strong>
        { this.props.hobbies.map(x => <Progress key={x[0]} text={x[0]} value={x[1]} />) }
      </section>
    );
  }
}

//  脚处信息
class FooterComponent extends React.Component {
  render() {
    return (
      <footer className="resume-footer">
        <a href="#">ningtaostudy.cn/resume</a>
        <a href="mailto:18255447846@163.com" className="mail" />
        <a href="https://github.com/LitileXueZha" className="github" target="_blank" />
        <a href="http://wpa.qq.com/msgrd?v=3&uin=1941639715&site=qq&menu=yes" className="qq" target="_blank" />
      </footer>
    );
  }
}

//  外部容器，切换中英文
class ProviderComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lang: 'zh',
    };
  }

  //  切换中英文
  changeLang() {
    this.setState({
      lang: this.state.lang === 'zh' ? 'en' : 'zh',
    });
  }

  render() {
    const { lang } = this.state;
    const { header, profile, title, experience, education, details, detailsKey, hobbies } = data[lang];
    return [
      <div className="resume-container" key="1">
        <div className="resume-col-left">
          <HeaderComponent {...header} />
          <div className="resume-body">
            <ProfileComponent profile={profile} title={title[0]} />
            <ExperienceComponent experience={experience} title={title[1]} />
            <EducationComponent education={education} title={title[2]} />
          </div>
        </div>
        <div className="resume-col-right">
          <DetailComponent title={title[3]} details={details} detailsKey={detailsKey} commonDetails={data.details} />
          <ExpertiseComponent title={title[4]} expertise={data.expertise}/>
          <HobbyComponent title={title[5]} hobbies={hobbies}/>
        </div>
      </div>,
      <FooterComponent key="2" />,
      <button className="btn-lang" onClick={() => this.changeLang()} key="3">{lang === 'zh' ? 'English' : '中文'}</button>,
    ];
  }
}

ReactDOM.render(<ProviderComponent />, document.querySelector('#root'));
