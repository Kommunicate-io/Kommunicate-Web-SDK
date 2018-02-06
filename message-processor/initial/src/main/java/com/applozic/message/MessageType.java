package com.applozic.message;

public enum MessageType {
	INBOX(0),
	OUTBOX(1),
	DRAFT(2),
	OUTBOX_SENT_FROM_DEVICE(3),
	MT_INBOX(4),
	MT_OUTBOX(5),
	CALL_INCOMING(6),
	CALL_OUTGOING(7);

	private Integer value;

	MessageType(Integer value) {
		this.value = value;
	}

	public Short getValue() {
		return value.shortValue();
	}
}
