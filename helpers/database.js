export default class Table {
	constructor(__modelSchema) {
		this.__modelSchema = __modelSchema;
	}

	GET(searchParams) {
		return this.__modelSchema.findOne(searchParams);
	}

	GET_ALL(searchParams) {
		return this.__modelSchema.findAll(searchParams);
	}

	CREATE(data) {
		return this.__modelSchema.create(data);
	}

	CREATE_MANY(data, config = {}) {
		return this.__modelSchema.bulkCreate(data, config);
	}

	UPDATE(identifier, data) {
		return this.__modelSchema.update(data, {
			where: identifier,
		});
	}

	DELETE(identifier, schema) {
		return this.__modelSchema.destroy({
			where: identifier,
		});
	}

	COUNT(identifier) {
		console.log('Identifier: ', identifier);
		return this.__modelSchema.count({
			where: identifier,
		});
	}

	MAX(col, identifier) {
		console.log('Column: ', col);
		console.log('Identifier: ', identifier);
		return this.__modelSchema.max(col, {
			where: identifier,
		});
	}

	MIN(col, identifier) {
		console.log('Column: ', col);
		console.log('Identifier: ', identifier);
		return this.__modelSchema.min(col, {
			where: identifier,
		});
	}

	SUM(col, identifier) {
		console.log('Column: ', col);
		console.log('Identifier: ', identifier);
		return this.__modelSchema.sum(col, {
			where: identifier,
		});
	}

	UPSERT(identifier, data) {
		return this.__modelSchema
			.findOne({
				where: identifier,
			})
			.then(result => {
				// console.log('Result Upsert', result)
				if (result) {
					return this.__modelSchema.update(data, {
						where: identifier,
					});
				} else {
					return this.__modelSchema.create(data);
				}
			});
	}

	UPSERT_MANY(id_key, data) {
		const promises = data.map(value => {
			if (value[id_key] !== undefined) {
				return this.__modelSchema.update(value, {
					where: { [id_key]: value[id_key] },
				});
			} else {
				return this.__modelSchema.create(value);
			}
		});

		return Promise.all(promises).then(() => {
			subscriber.complete();
		});
	}
}
