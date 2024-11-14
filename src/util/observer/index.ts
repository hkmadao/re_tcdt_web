/**消息 */
export type TMessage = {
  /**消息主题，消费者要根据这个字段查找消息，所有组件的消息不能重复 */
  topic: string;
  /**消息生产者id */
  producerId: string;
  /**已经消费了此条消息的消费者 */
  consumerIds: string[];
  data: any;
  //此字段触发页面状态转变
  /**@deprecated */
  status?: string;
};

/**主题 */
export class Subject {
  observers: Observer[] = [];
  /**页面观察者，需要对页面状态进行观察的特殊观察者 */
  /**@deprecated */
  pageObserver?: Observer = undefined;
  msgs: { [x: string]: TMessage } = {};
  constructor() {}
  /**@deprecated */
  setPageObserver(pageObserver: Observer) {
    this.pageObserver = pageObserver;
  }
  publish(message: Omit<TMessage, 'consumerIds'>) {
    const newMsg: TMessage = { ...message, consumerIds: [] };
    this.msgs[newMsg.topic] = newMsg;
    //页面观察者需要负责修改页面状态
    this.pageObserver?.update(newMsg);
    this.observers.forEach((observer) => {
      if (observer.topic === newMsg.topic) {
        observer.update(newMsg);
        this.msgs[observer.topic]?.consumerIds.push(observer.consumerId);
      }
    });
  }
  subscribe(observer: Observer) {
    //同一个消费者只能订阅一次相同主题
    const observerFilters = this.observers.filter(
      (tempObserver) =>
        !(
          tempObserver.consumerId === observer.consumerId &&
          tempObserver.topic === observer.topic
        ),
    );

    observerFilters.push(observer);
    this.observers = observerFilters;
    //如果此前有消息，发送给观察者
    if (this.msgs[observer.topic]) {
      observer.update(this.msgs[observer.topic]);
      this.msgs[observer.topic]?.consumerIds.push(observer.consumerId);
    }
  }
  unsubsribe(observer: Observer) {
    this.observers = this.observers.filter(
      (tempObserver) =>
        !(
          tempObserver.consumerId === observer.consumerId &&
          tempObserver.topic === observer.topic
        ),
    );
  }
}

/**观察者 */
export interface Observer {
  /**观察主题 */
  topic: string;
  /**消费者id */
  consumerId: string;
  /**当有主题消息到达时触发的方法 */
  update(message: TMessage): void;
}
