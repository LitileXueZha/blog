import React from 'react';
import ReactDOM from 'react-dom';
import data from './data.js';

import './index.less';

// 头部组件
function Header(props) {
  const { name, role, location } = props;
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

//  个人简介
function Profile(props) {
  return (
    <figure className="item">
      <figcaption className="item-title">{props.title}</figcaption>
      <div className="item-content">{props.profile}</div>
    </figure>
  );
}

//  工作经历
function Experience(props) {
  return (
    <figure className="item">
      <figcaption className="item-title">{props.title}</figcaption>
      <div className="item-content">
        {props.experience.map(x => (
          <div key={x.name} className="item-exp">
            <strong className="item-exp-name">{x.name}</strong>
            <time className="item-exp-time">{x.time}</time>
            <p className="item-exp-content">{x.content}</p>
          </div>
        ))}
      </div>
    </figure>
  );
}

//  教育经历
function Education(props) {
  return (
    <figure className="item">
      <figcaption className="item-title">{props.title}</figcaption>
      <div className="item-content">
      {props.education.map(x => (
        <div key={x.name} className="item-exp">
          <strong className="item-exp-name">{x.name}</strong>
          <time className="item-exp-time">{x.time}</time>
          { x.content.map(y => <p className="item-exp-content" key={y}>{y}</p>) }
        </div>
      ))}
      </div>
    </figure>
  );
}

//  详细信息
function Detail(props) {
  const { title, details, detailsKey, commonDetails } = props;
  const arr = [...commonDetails];
  arr.splice(1, 0, details);
  return (
    <section className="item-right">
      <strong className="item-right-title">{title}</strong>
      {arr.map((x, i) => (
        <p className="item-right-p" key={x}>
          <span className="item-right-p-label">{detailsKey[i]}</span>
          {x}
        </p>
      ))}
    </section>
  );
}

//  进度条
function Progress(props) {
  return (
    <div className="progress-container">
      <span className="progress-text">{props.text}</span>
      <div className="progress-total">
        <div className="progress-value" style={{ width: `${props.value}%` }} />
      </div>
    </div>
  );

}

//  专业技能
function Expertise(props) {
  return (
    <section className="item-right">
      <strong className="item-right-title">{props.title}</strong>
      {props.expertise.map(x => <Progress key={x[0]} text={x[0]} value={x[1]} />)}
    </section>
  );

}

//  爱好
function Hobby(props) {
  return (
    <section className="item-right">
      <strong className="item-right-title">{props.title}</strong>
      { props.hobbies.map(x => <Progress key={x[0]} text={x[0]} value={x[1]} />) }
    </section>
  );
}

//  脚处信息
function Footer(props) {
  return (
    <footer className="resume-footer">
      <a href="#">ningtaostudy.cn/resume</a>
      <a href="mailto:18255447846@163.com" className="mail" rel="nofollow noopener noreferrer" />
      <a href="https://github.com/LitileXueZha" className="github" target="_blank" rel="nofollow noopener noreferrer" />
      <a href="http://wpa.qq.com/msgrd?v=3&uin=1941639715&site=qq&menu=yes" className="qq" target="_blank" rel="nofollow noopener noreferrer" />
    </footer>
  );
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
    return (
      <>
        <div className="resume-container">
          <div className="resume-col-left">
            <Header {...header} />
            <div className="resume-body">
              <Profile profile={profile} title={title[0]} />
              <Experience experience={experience} title={title[1]} />
              <Education education={education} title={title[2]} />
            </div>
          </div>
          <div className="resume-col-right">
            <Detail title={title[3]} details={details} detailsKey={detailsKey} commonDetails={data.details} />
            <Expertise title={title[4]} expertise={data.expertise}/>
            <Hobby title={title[5]} hobbies={hobbies}/>
          </div>
        </div>
        <Footer />
        <button className="btn-lang" onClick={() => this.changeLang()} >{lang === 'zh' ? 'English' : '中文'}</button>
      </>
    );
  }
}

ReactDOM.render(<ProviderComponent />, document.querySelector('#root'));
