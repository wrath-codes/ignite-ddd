import { AggregateRoot } from '../entities/aggregate-root'
import { DomainEvent } from './domain-event'
import { DomainEvents } from './domain-events'
import { UniqueEntityID } from '../entities/unique-entity-id'

class CustomAggregateCreated implements DomainEvent {
  public ocurredAt: Date
  // eslint-disable-next-line no-use-before-define
  private aggregate: CustomAggregate

  constructor(aggregate: CustomAggregate) {
    this.ocurredAt = new Date()
    this.aggregate = aggregate
  }

  public getAggregateId(): UniqueEntityID {
    return this.aggregate.id
  }
}

class CustomAggregate extends AggregateRoot<any> {
  static create() {
    const aggregate = new CustomAggregate(null)

    aggregate.addDomainEvent(new CustomAggregateCreated(aggregate))

    return aggregate
  }
}

describe('Domain Events', () => {
  it('should be able to dispatch and listen to domain events', () => {
    const callbackSpy = vi.fn()

    // Subscriber to domain events (listening to created answer events)
    DomainEvents.register(callbackSpy, CustomAggregateCreated.name)

    // Created answer but didn't save it yet
    const aggregate = CustomAggregate.create()

    // Assert that the callback was not called yet
    expect(aggregate.domainEvents).toHaveLength(1)

    // Saving the answer in the database, dispatching the event
    DomainEvents.dispatchEventsForAggregate(aggregate.id)

    // Subscriber listen to the event and does what needs to be done in the database
    expect(callbackSpy).toHaveBeenCalled()

    // Assert that the callback was called
    expect(aggregate.domainEvents).toHaveLength(0)
  })
})
