/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package hello;

/**
 *
 * @author devashish
 */
public enum StatusType {
	UNREAD(0),
	READ(1),
	PENDING(2),
	SENT(3),
	DELIVERED(4),
	DELIVERED_AND_READ(5);
	
	private Integer value;

	StatusType(Integer value) {
		this.value = value;
	}

	public Short getValue() {
		return value.shortValue();
	}
}

