/// <reference lib="esnext.asynciterable" />

declare interface Agent {
    maxFreeSockets: number;
    maxSockets: number;
    sockets: any;
    requests: any;
    destroy(): void;
}

declare interface AuthOptions {
    /** Account master key or read only key */
    key?: string;
    /** The authorization master key to use to create the client. */
    masterKey?: string;
    /** An object that contains resources tokens.
     * Keys for the object are resource Ids and values are the resource tokens.
     */
    resourceTokens?: {
        [resourcePath: string]: string;
    };
    /** A user supplied function for resolving header authorization tokens.
     * Allows users to generating their own auth tokens, potentially using a separate service
     */
    tokenProvider?: TokenProvider;
    /** An array of {@link Permission} objects. */
    permissionFeed?: PermissionDefinition[];
}

/**
 * Provides iterator for change feed.
 *
 * Use `Items.readChangeFeed()` to get an instance of the iterator.
 */
declare class ChangeFeedIterator<T> {
    private clientContext;
    private resourceId;
    private resourceLink;
    private partitionKey;
    private isPartitionedContainer;
    private changeFeedOptions;
    private static readonly IfNoneMatchAllHeaderValue;
    private nextIfNoneMatch;
    private ifModifiedSince;
    private lastStatusCode;
    private isPartitionSpecified;
    /**
     * @internal
     * @hidden
     *
     * @param clientContext
     * @param resourceId
     * @param resourceLink
     * @param isPartitionedContainer
     * @param changeFeedOptions
     */
    constructor(clientContext: ClientContext, resourceId: string, resourceLink: string, partitionKey: string | number | boolean, isPartitionedContainer: () => Promise<boolean>, changeFeedOptions: ChangeFeedOptions);
    /**
     * Gets a value indicating whether there are potentially additional results that can be retrieved.
     *
     * Initially returns true. This value is set based on whether the last execution returned a continuation token.
     *
     * @returns Boolean value representing if whether there are potentially additional results that can be retrieved.
     */
    readonly hasMoreResults: boolean;
    /**
     * Gets an async iterator which will yield pages of results from Azure Cosmos DB.
     */
    getAsyncIterator(): AsyncIterable<ChangeFeedResponse<Array<T & Resource>>>;
    /**
     * Read feed and retrieves the next page of results in Azure Cosmos DB.
     */
    executeNext(): Promise<ChangeFeedResponse<Array<T & Resource>>>;
    private getFeedResponse;
}

/**
 * Specifies options for the change feed
 *
 * Some of these options control where and when to start reading from the change feed. The order of precedence is:
 * - continuation
 * - startTime
 * - startFromBeginning
 *
 * If none of those options are set, it will start reading changes from the first `ChangeFeedIterator.executeNext()` call.
 */
declare interface ChangeFeedOptions {
    /**
     * Max amount of items to return per page
     */
    maxItemCount?: number;
    /**
     * The continuation token to start from.
     *
     * This is equivalent to the etag and continuation value from the `ChangeFeedResponse`
     */
    continuation?: string;
    /**
     * The session token to use. If not specified, will use the most recent captured session token to start with.
     */
    sessionToken?: string;
    /**
     * Signals whether to start from the beginning or not.
     */
    startFromBeginning?: boolean;
    /**
     * Specified the start time to start reading changes from.
     */
    startTime?: Date;
}

/**
 * A single response page from the Azure Cosmos DB Change Feed
 */
declare class ChangeFeedResponse<T> {
    /**
     * Gets the items returned in the response from Azure Cosmos DB
     */
    readonly result: T;
    /**
     * Gets the number of items returned in the response from Azure Cosmos DB
     */
    readonly count: number;
    /**
     * Gets the status code of the response from Azure Cosmos DB
     */
    readonly statusCode: number;
    /**
     * @internal
     * @hidden
     *
     * @param result
     * @param count
     * @param statusCode
     * @param headers
     */
    constructor(
    /**
     * Gets the items returned in the response from Azure Cosmos DB
     */
    result: T, 
    /**
     * Gets the number of items returned in the response from Azure Cosmos DB
     */
    count: number, 
    /**
     * Gets the status code of the response from Azure Cosmos DB
     */
    statusCode: number, headers: CosmosHeaders);
    /**
     * Gets the request charge for this request from the Azure Cosmos DB service.
     */
    readonly requestCharge: number;
    /**
     * Gets the activity ID for the request from the Azure Cosmos DB service.
     */
    readonly activityId: string;
    /**
     * Gets the continuation token to be used for continuing enumeration of the Azure Cosmos DB service.
     *
     * This is equivalent to the `etag` property.
     */
    readonly continuation: string;
    /**
     * Gets the session token for use in session consistency reads from the Azure Cosmos DB service.
     */
    readonly sessionToken: string;
    /**
     * Gets the entity tag associated with last transaction in the Azure Cosmos DB service,
     * which can be used as If-Non-Match Access condition for ReadFeed REST request or
     * `continuation` property of `ChangeFeedOptions` parameter for
     * `Items.readChangeFeed()`
     * to get feed changes since the transaction specified by this entity tag.
     *
     * This is equivalent to the `continuation` property.
     */
    readonly etag: string;
    /**
     * Response headers of the response from Azure Cosmos DB
     */
    headers: CosmosHeaders;
}

/**
 * @hidden
 * @ignore
 */
declare class ClientContext {
    private cosmosClientOptions;
    private globalEndpointManager;
    private readonly sessionContainer;
    private connectionPolicy;
    partitionKeyDefinitionCache: {
        [containerUrl: string]: any;
    };
    constructor(cosmosClientOptions: CosmosClientOptions, globalEndpointManager: GlobalEndpointManager);
    /** @ignore */
    read<T>(path: string, resourceType: ResourceType, resourceId: string, options?: RequestOptions): Promise<Response<T & Resource>>;
    queryFeed<T>(path: string, resourceType: ResourceType, resourceId: string, resultFn: (result: {
        [key: string]: any;
    }) => any[], // TODO: any
    query: SqlQuerySpec | string, options: FeedOptions, partitionKeyRangeId?: string): Promise<Response<T & Resource>>;
    queryPartitionKeyRanges(collectionLink: string, query?: string | SqlQuerySpec, options?: FeedOptions): QueryIterator<PartitionKeyRange>;
    delete<T>(path: string, resourceType: ResourceType, resourceId: string, options?: RequestOptions): Promise<Response<T & Resource>>;
    create<T, U = T>(body: T, path: string, resourceType: ResourceType, resourceId: string, options?: RequestOptions): Promise<Response<T & U & Resource>>;
    private processQueryFeedResponse;
    private applySessionToken;
    replace<T>(body: any, path: string, resourceType: ResourceType, resourceId: string, options?: RequestOptions): Promise<Response<T & Resource>>;
    upsert<T, U = T>(body: T, path: string, resourceType: ResourceType, resourceId: string, options?: RequestOptions): Promise<Response<T & U & Resource>>;
    execute<T>(sprocLink: string, params?: any[], // TODO: any
    options?: RequestOptions): Promise<Response<T>>;
    /**
     * Gets the Database account information.
     * @param {string} [options.urlConnection]   - The endpoint url whose database account needs to be retrieved. \
     * If not present, current client's url will be used.
     */
    getDatabaseAccount(options?: RequestOptions): Promise<Response<DatabaseAccount>>;
    getWriteEndpoint(): Promise<string>;
    getReadEndpoint(): Promise<string>;
    private captureSessionToken;
    clearSessionToken(path: string): void;
    private getSessionParams;
    private isMasterResource;
    private buildHeaders;
}

export declare class ClientSideMetrics {
    readonly requestCharge: number;
    constructor(requestCharge: number);
    /**
     * Adds one or more ClientSideMetrics to a copy of this instance and returns the result.
     */
    add(...clientSideMetricsArray: ClientSideMetrics[]): ClientSideMetrics;
    static readonly zero: ClientSideMetrics;
    static createFromArray(...clientSideMetricsArray: ClientSideMetrics[]): ClientSideMetrics;
}

/** @hidden */
declare type CompareFunction = (x: Point, y: Point) => number;

/**
 * Use to read or delete a given {@link Conflict} by id.
 *
 * @see {@link Conflicts} to query or read all conflicts.
 */
export declare class Conflict {
    readonly container: Container;
    readonly id: string;
    private readonly clientContext;
    /**
     * Returns a reference URL to the resource. Used for linking in Permissions.
     */
    readonly url: string;
    /**
     * @hidden
     * @param container The parent {@link Container}.
     * @param id The id of the given {@link Conflict}.
     */
    constructor(container: Container, id: string, clientContext: ClientContext);
    /**
     * Read the {@link ConflictDefinition} for the given {@link Conflict}.
     * @param options
     */
    read(options?: RequestOptions): Promise<ConflictResponse>;
    /**
     * Delete the given {@link ConflictDefinition}.
     * @param options
     */
    delete(options?: RequestOptions): Promise<ConflictResponse>;
}

export declare interface ConflictDefinition {
    /** The id of the conflict */
    id?: string;
    /** Source resource id */
    resourceId?: string;
    resourceType?: ResourceType;
    operationType?: OperationType;
    content?: string;
}

export declare enum ConflictResolutionMode {
    Custom = "Custom",
    LastWriterWins = "LastWriterWins"
}

/**
 * Represents the conflict resolution policy configuration for specifying how to resolve conflicts
 *  in case writes from different regions result in conflicts on documents in the collection in the Azure Cosmos DB service.
 */
export declare interface ConflictResolutionPolicy {
    /**
     * Gets or sets the <see cref="ConflictResolutionMode"/> in the Azure Cosmos DB service. By default it is {@link ConflictResolutionMode.LastWriterWins}.
     */
    mode?: keyof typeof ConflictResolutionMode;
    /**
     * Gets or sets the path which is present in each document in the Azure Cosmos DB service for last writer wins conflict-resolution.
     * This path must be present in each document and must be an integer value.
     * In case of a conflict occurring on a document, the document with the higher integer value in the specified path will be picked.
     * If the path is unspecified, by default the timestamp path will be used.
     *
     * This value should only be set when using {@link ConflictResolutionMode.LastWriterWins}.
     *
     * ```typescript
     * conflictResolutionPolicy.ConflictResolutionPath = "/name/first";
     * ```
     *
     */
    conflictResolutionPath?: string;
    /**
     * Gets or sets the {@link StoredProcedure} which is used for conflict resolution in the Azure Cosmos DB service.
     * This stored procedure may be created after the {@link Container} is created and can be changed as required.
     *
     * 1. This value should only be set when using {@link ConflictResolutionMode.Custom}.
     * 2. In case the stored procedure fails or throws an exception, the conflict resolution will default to registering conflicts in the conflicts feed.
     *
     * ```typescript
     * conflictResolutionPolicy.ConflictResolutionProcedure = "resolveConflict"
     * ```
     */
    conflictResolutionProcedure?: string;
}

export declare class ConflictResponse extends ResourceResponse<ConflictDefinition & Resource> {
    constructor(resource: ConflictDefinition & Resource, headers: CosmosHeaders, statusCode: number, conflict: Conflict);
    /** A reference to the {@link Conflict} corresponding to the returned {@link ConflictDefinition}. */
    readonly conflict: Conflict;
}

/**
 * Use to query or read all conflicts.
 *
 * @see {@link Conflict} to read or delete a given {@link Conflict} by id.
 */
export declare class Conflicts {
    readonly container: Container;
    private readonly clientContext;
    constructor(container: Container, clientContext: ClientContext);
    /**
     * Queries all conflicts.
     * @param query Query configuration for the operation. See {@link SqlQuerySpec} for more info on how to configure a query.
     * @param options Use to set options like response page size, continuation tokens, etc.
     * @returns {@link QueryIterator} Allows you to return results in an array or iterate over them one at a time.
     */
    query(query: string | SqlQuerySpec, options?: FeedOptions): QueryIterator<any>;
    /**
     * Queries all conflicts.
     * @param query Query configuration for the operation. See {@link SqlQuerySpec} for more info on how to configure a query.
     * @param options Use to set options like response page size, continuation tokens, etc.
     * @returns {@link QueryIterator} Allows you to return results in an array or iterate over them one at a time.
     */
    query<T>(query: string | SqlQuerySpec, options?: FeedOptions): QueryIterator<T>;
    /**
     * Reads all conflicts
     * @param options Use to set options like response page size, continuation tokens, etc.
     */
    readAll(options?: FeedOptions): QueryIterator<ConflictDefinition & Resource>;
}

/** Determines the connection behavior of the CosmosClient. Note, we currently only support Gateway Mode. */
export declare enum ConnectionMode {
    /** Gateway mode talks to a intermediate gateway which handles the direct communicationi with your individual partitions. */
    Gateway = 0
}

/**
 * Represents the Connection policy associated with a CosmosClient in the Azure Cosmos DB database service.
 */
export declare interface ConnectionPolicy {
    /** Determines which mode to connect to Cosmos with. (Currently only supports Gateway option) */
    connectionMode?: ConnectionMode;
    /** Request timeout (time to wait for response from network peer). Represented in milliseconds. */
    requestTimeout?: number;
    /** Flag to enable/disable automatic redirecting of requests based on read/write operations. */
    enableEndpointDiscovery?: boolean;
    /** List of azure regions to be used as preferred locations for read requests. */
    preferredLocations?: string[];
    /** RetryOptions object which defines several configurable properties used during retry. */
    retryOptions?: RetryOptions;
    /**
     * Flag to disable SSL verification for the requests. SSL verification is enabled by default. Don't set this when targeting production endpoints.
     * This is intended to be used only when targeting emulator endpoint to avoid failing your requests with SSL related error.
     */
    disableSSLVerification?: boolean;
    /**
     * The flag that enables writes on any locations (regions) for geo-replicated database accounts in the Azure Cosmos DB service.
     * Default is `false`.
     */
    useMultipleWriteLocations?: boolean;
}

/**
 * Represents the consistency levels supported for Azure Cosmos DB client operations.<br>
 * The requested ConsistencyLevel must match or be weaker than that provisioned for the database account.
 * Consistency levels.
 *
 * Consistency levels by order of strength are Strong, BoundedStaleness, Session, Consistent Prefix, and Eventual.
 *
 * See https://aka.ms/cosmos-consistency for more detailed documentation on Consistency Levels.
 */
export declare enum ConsistencyLevel {
    /**
     * Strong Consistency guarantees that read operations always return the value that was last written.
     */
    Strong = "Strong",
    /**
     * Bounded Staleness guarantees that reads are not too out-of-date.
     * This can be configured based on number of operations (MaxStalenessPrefix) or time (MaxStalenessIntervalInSeconds).
     */
    BoundedStaleness = "BoundedStaleness",
    /**
     * Session Consistency guarantees monotonic reads (you never read old data, then new, then old again),
     * monotonic writes (writes are ordered) and read your writes (your writes are immediately visible to your reads)
     * within any single session.
     */
    Session = "Session",
    /**
     * Eventual Consistency guarantees that reads will return a subset of writes.
     * All writes will be eventually be available for reads.
     */
    Eventual = "Eventual",
    /**
     * ConsistentPrefix Consistency guarantees that reads will return some prefix of all writes with no gaps.
     * All writes will be eventually be available for reads.`
     */
    ConsistentPrefix = "ConsistentPrefix"
}

export declare const Constants: {
    MediaTypes: {
        Any: string;
        ImageJpeg: string;
        ImagePng: string;
        Javascript: string;
        Json: string;
        OctetStream: string;
        QueryJson: string;
        SQL: string;
        TextHtml: string;
        TextPlain: string;
        Xml: string;
    };
    HttpHeaders: {
        Authorization: string;
        ETag: string;
        MethodOverride: string;
        Slug: string;
        ContentType: string;
        LastModified: string;
        ContentEncoding: string;
        CharacterSet: string;
        UserAgent: string;
        IfModifiedSince: string;
        IfMatch: string;
        IfNoneMatch: string;
        ContentLength: string;
        AcceptEncoding: string;
        KeepAlive: string;
        CacheControl: string;
        TransferEncoding: string;
        ContentLanguage: string;
        ContentLocation: string;
        ContentMd5: string;
        ContentRange: string;
        Accept: string;
        AcceptCharset: string;
        AcceptLanguage: string;
        IfRange: string;
        IfUnmodifiedSince: string;
        MaxForwards: string;
        ProxyAuthorization: string;
        AcceptRanges: string;
        ProxyAuthenticate: string;
        RetryAfter: string;
        SetCookie: string;
        WwwAuthenticate: string;
        Origin: string;
        Host: string;
        AccessControlAllowOrigin: string;
        AccessControlAllowHeaders: string;
        KeyValueEncodingFormat: string;
        WrapAssertionFormat: string;
        WrapAssertion: string;
        WrapScope: string;
        SimpleToken: string;
        HttpDate: string;
        Prefer: string;
        Location: string;
        Referer: string;
        A_IM: string;
        Query: string;
        IsQuery: string;
        Continuation: string;
        PageSize: string;
        ItemCount: string;
        ActivityId: string;
        PreTriggerInclude: string;
        PreTriggerExclude: string;
        PostTriggerInclude: string;
        PostTriggerExclude: string;
        IndexingDirective: string;
        SessionToken: string;
        ConsistencyLevel: string;
        XDate: string;
        CollectionPartitionInfo: string;
        CollectionServiceInfo: string;
        RetryAfterInMilliseconds: string;
        IsFeedUnfiltered: string;
        ResourceTokenExpiry: string;
        EnableScanInQuery: string;
        EmitVerboseTracesInQuery: string;
        EnableCrossPartitionQuery: string;
        ParallelizeCrossPartitionQuery: string;
        PopulateQueryMetrics: string;
        QueryMetrics: string;
        Version: string;
        OwnerFullName: string;
        OwnerId: string;
        PartitionKey: string;
        PartitionKeyRangeID: string;
        MaxEntityCount: string;
        CurrentEntityCount: string;
        CollectionQuotaInMb: string;
        CollectionCurrentUsageInMb: string;
        MaxMediaStorageUsageInMB: string;
        CurrentMediaStorageUsageInMB: string;
        RequestCharge: string;
        PopulateQuotaInfo: string;
        MaxResourceQuota: string;
        OfferType: string;
        OfferThroughput: string;
        DisableRUPerMinuteUsage: string;
        IsRUPerMinuteUsed: string;
        OfferIsRUPerMinuteThroughputEnabled: string;
        IndexTransformationProgress: string;
        LazyIndexingProgress: string;
        IsUpsert: string;
        SubStatus: string;
        EnableScriptLogging: string;
        ScriptLogResults: string;
        ALLOW_MULTIPLE_WRITES: string;
    };
    WritableLocations: string;
    ReadableLocations: string;
    Name: string;
    DatabaseAccountEndpoint: string;
    ENABLE_MULTIPLE_WRITABLE_LOCATIONS: string;
    DefaultUnavailableLocationExpirationTimeMS: number;
    ThrottleRetryCount: string;
    ThrottleRetryWaitTimeInMs: string;
    CurrentVersion: string;
    SDKName: string;
    SDKVersion: string;
    DefaultPrecisions: {
        DefaultNumberHashPrecision: number;
        DefaultNumberRangePrecision: number;
        DefaultStringHashPrecision: number;
        DefaultStringRangePrecision: number;
    };
    ConsistentHashRing: {
        DefaultVirtualNodesPerCollection: number;
    };
    RegularExpressions: {
        TrimLeftSlashes: RegExp;
        TrimRightSlashes: RegExp;
        IllegalResourceIdCharacters: RegExp;
    };
    Quota: {
        CollectionSize: string;
    };
    Path: {
        DatabasesPathSegment: string;
        CollectionsPathSegment: string;
        UsersPathSegment: string;
        DocumentsPathSegment: string;
        PermissionsPathSegment: string;
        StoredProceduresPathSegment: string;
        TriggersPathSegment: string;
        UserDefinedFunctionsPathSegment: string;
        ConflictsPathSegment: string;
        AttachmentsPathSegment: string;
        PartitionKeyRangesPathSegment: string;
        SchemasPathSegment: string;
        OffersPathSegment: string;
        TopologyPathSegment: string;
        DatabaseAccountPathSegment: string;
    };
    PartitionKeyRange: {
        MinInclusive: string;
        MaxExclusive: string;
        Id: string;
    };
    QueryRangeConstants: {
        MinInclusive: string;
        MaxExclusive: string;
        min: string;
    };
    EffectiveParitionKeyConstants: {
        MinimumInclusiveEffectivePartitionKey: string;
        MaximumExclusiveEffectivePartitionKey: string;
    };
};

/**
 * Operations for reading, replacing, or deleting a specific, existing container by id.
 *
 * @see {@link Containers} for creating new containers, and reading/querying all containers; use `.containers`.
 *
 * Note: all these operations make calls against a fixed budget.
 * You should design your system such that these calls scale sublinearly with your application.
 * For instance, do not call `container(id).read()` before every single `item.read()` call, to ensure the container exists;
 * do this once on application start up.
 */
export declare class Container {
    readonly database: Database;
    readonly id: string;
    private readonly clientContext;
    private $items;
    /**
     * Operations for creating new items, and reading/querying all items
     *
     * For reading, replacing, or deleting an existing item, use `.item(id)`.
     *
     * @example Create a new item
     * ```typescript
     * const {body: createdItem} = await container.items.create({id: "<item id>", properties: {}});
     * ```
     */
    readonly items: Items;
    private $scripts;
    /**
     * All operations for Stored Procedures, Triggers, and User Defined Functions
     */
    readonly scripts: Scripts;
    private $conflicts;
    /**
     * Opertaions for reading and querying conflicts for the given container.
     *
     * For reading or deleting a specific conflict, use `.conflict(id)`.
     */
    readonly conflicts: Conflicts;
    /**
     * Returns a reference URL to the resource. Used for linking in Permissions.
     */
    readonly url: string;
    /**
     * Returns a container instance. Note: You should get this from `database.container(id)`, rather than creating your own object.
     * @param database The parent {@link Database}.
     * @param id The id of the given container.
     * @hidden
     */
    constructor(database: Database, id: string, clientContext: ClientContext);
    /**
     * Used to read, replace, or delete a specific, existing {@link Item} by id.
     *
     * Use `.items` for creating new items, or querying/reading all items.
     *
     * @param id The id of the {@link Item}.
     * @param partitionKey The partition key of the {@link Item}. (Required for partitioned containers).
     * @example Replace an item
     * const {body: replacedItem} = await container.item("<item id>").replace({id: "<item id>", title: "Updated post", authorID: 5});
     */
    item(id: string, partitionKey?: string): Item;
    /**
     * Used to read, replace, or delete a specific, existing {@link Conflict} by id.
     *
     * Use `.conflicts` for creating new conflicts, or querying/reading all conflicts.
     * @param id The id of the {@link Conflict}.
     */
    conflict(id: string): Conflict;
    /** Read the container's definition */
    read(options?: RequestOptions): Promise<ContainerResponse>;
    /** Replace the container's definition */
    replace(body: ContainerDefinition, options?: RequestOptions): Promise<ContainerResponse>;
    /** Delete the container */
    delete(options?: RequestOptions): Promise<ContainerResponse>;
    /**
     * Gets the partition key definition first by looking into the cache otherwise by reading the collection.
     * @ignore
     * @param {string} collectionLink   - Link to the collection whose partition key needs to be extracted.
     * @param {function} callback       - \
     * The arguments to the callback are(in order): error, partitionKeyDefinition, response object and response headers
     */
    getPartitionKeyDefinition(): Promise<ResourceResponse<PartitionKeyDefinition>>;
    readPartitionKeyRanges(feedOptions?: FeedOptions): QueryIterator<PartitionKeyRange>;
}

export declare interface ContainerDefinition {
    /** The id of the container. */
    id?: string;
    /**  TODO */
    partitionKey?: PartitionKeyDefinition;
    /** The indexing policy associated with the container. */
    indexingPolicy?: IndexingPolicy;
    /** The default time to live in seconds for items in a container. */
    defaultTtl?: number;
    /** The conflict resolution policy used to resolve conflicts in a container. */
    conflictResolutionPolicy?: ConflictResolutionPolicy;
    /** Policy for additional keys that must be unique per partion key */
    uniqueKeyPolicy?: UniqueKeyPolicy;
}

declare interface ContainerRequest extends ContainerDefinition {
    /** Throughput for this container. */
    throughput?: number;
}

/** Response object for Container operations */
export declare class ContainerResponse extends ResourceResponse<ContainerDefinition & Resource> {
    constructor(resource: ContainerDefinition & Resource, headers: CosmosHeaders, statusCode: number, container: Container);
    /** A reference to the {@link Container} that the returned {@link ContainerDefinition} corresponds to. */
    readonly container: Container;
}

/**
 * Operations for creating new containers, and reading/querying all containers
 *
 * @see {@link Container} for reading, replacing, or deleting an existing container; use `.container(id)`.
 *
 * Note: all these operations make calls against a fixed budget.
 * You should design your system such that these calls scale sublinearly with your application.
 * For instance, do not call `containers.readAll()` before every single `item.read()` call, to ensure the container exists;
 * do this once on application start up.
 */
export declare class Containers {
    readonly database: Database;
    private readonly clientContext;
    constructor(database: Database, clientContext: ClientContext);
    /**
     * Queries all containers.
     * @param query Query configuration for the operation. See {@link SqlQuerySpec} for more info on how to configure a query.
     * @param options Use to set options like response page size, continuation tokens, etc.
     * @returns {@link QueryIterator} Allows you to return specific contaienrs in an array or iterate over them one at a time.
     * @example Read all containers to array.
     * ```typescript
     * const querySpec: SqlQuerySpec = {
     *   query: "SELECT * FROM root r WHERE r.id = @container",
     *   parameters: [
     *     {name: "@container", value: "Todo"}
     *   ]
     * };
     * const {body: containerList} = await client.database("<db id>").containers.query(querySpec).toArray();
     * ```
     */
    query(query: SqlQuerySpec, options?: FeedOptions): QueryIterator<any>;
    /**
     * Queries all containers.
     * @param query Query configuration for the operation. See {@link SqlQuerySpec} for more info on how to configure a query.
     * @param options Use to set options like response page size, continuation tokens, etc.
     * @returns {@link QueryIterator} Allows you to return specific contaienrs in an array or iterate over them one at a time.
     * @example Read all containers to array.
     * ```typescript
     * const querySpec: SqlQuerySpec = {
     *   query: "SELECT * FROM root r WHERE r.id = @container",
     *   parameters: [
     *     {name: "@container", value: "Todo"}
     *   ]
     * };
     * const {body: containerList} = await client.database("<db id>").containers.query(querySpec).toArray();
     * ```
     */
    query<T>(query: SqlQuerySpec, options?: FeedOptions): QueryIterator<T>;
    /**
     * Creates a container.
     *
     * A container is a named logical container for items.
     *
     * A database may contain zero or more named containers and each container consists of
     * zero or more JSON items.
     *
     * Being schema-free, the items in a container do not need to share the same structure or fields.
     *
     *
     * Since containers are application resources, they can be authorized using either the
     * master key or resource keys.
     *
     * @param body Represents the body of the container.
     * @param options Use to set options like response page size, continuation tokens, etc.
     */
    create(body: ContainerRequest, options?: RequestOptions): Promise<ContainerResponse>;
    /**
     * Checks if a Container exists, and, if it doesn't, creates it.
     * This will make a read operation based on the id in the `body`, then if it is not found, a create operation.
     * You should confirm that the output matches the body you passed in for non-default properties (i.e. indexing policy/etc.)
     *
     * A container is a named logical container for items.
     *
     * A database may contain zero or more named containers and each container consists of
     * zero or more JSON items.
     *
     * Being schema-free, the items in a container do not need to share the same structure or fields.
     *
     *
     * Since containers are application resources, they can be authorized using either the
     * master key or resource keys.
     *
     * @param body Represents the body of the container.
     * @param options Use to set options like response page size, continuation tokens, etc.
     */
    createIfNotExists(body: ContainerRequest, options?: RequestOptions): Promise<ContainerResponse>;
    /**
     * Read all containers.
     * @param options Use to set options like response page size, continuation tokens, etc.
     * @returns {@link QueryIterator} Allows you to return all containers in an array or iterate over them one at a time.
     * @example Read all containers to array.
     * ```typescript
     * const {body: containerList} = await client.database("<db id>").containers.readAll().toArray();
     * ```
     */
    readAll(options?: FeedOptions): QueryIterator<ContainerDefinition & Resource>;
}

/**
 * Provides a client-side logical representation of the Azure Cosmos DB database account.
 * This client is used to configure and execute requests in the Azure Cosmos DB database service.
 * @example Instantiate a client and create a new database
 * ```typescript
 * const client = new CosmosClient({endpoint: "<URL HERE>", auth: {masterKey: "<KEY HERE>"}});
 * await client.databases.create({id: "<datbase name here>"});
 * ```
 * @example Instantiate a client with custom Connection Policy
 * ```typescript
 * const connectionPolicy = new ConnectionPolicy();
 * connectionPolicy.RequestTimeout = 10000;
 * const client = new CosmosClient({
 *    endpoint: "<URL HERE>",
 *    auth: {masterKey: "<KEY HERE>"},
 *    connectionPolicy
 * });
 * ```
 */
export declare class CosmosClient {
    private options;
    /**
     * Used for creating new databases, or querying/reading all databases.
     *
     * Use `.database(id)` to read, replace, or delete a specific, existing database by id.
     *
     * @example Create a new database
     * ```typescript
     * const {resource: databaseDefinition, database} = await client.databases.create({id: "<name here>"});
     * ```
     */
    readonly databases: Databases;
    /**
     * Used for querying & reading all offers.
     *
     * Use `.offer(id)` to read, or replace existing offers.
     */
    readonly offers: Offers;
    /**
     * Creates a new {@link CosmosClient} object. See {@link CosmosClientOptions} for more details on what options you can use.
     * @param options bag of options - require at least endpoint and auth to be configured
     */
    private clientContext;
    constructor(options: CosmosClientOptions);
    /**
     * Get information about the current {@link DatabaseAccount} (including which regions are supported, etc.)
     */
    getDatabaseAccount(options?: RequestOptions): Promise<ResourceResponse<DatabaseAccount>>;
    /**
     * Gets the currently used write endpoint url. Useful for troubleshooting purposes.
     *
     * The url may contain a region suffix (e.g. "-eastus") if we're using location specific endpoints.
     */
    getWriteEndpoint(): Promise<string>;
    /**
     * Gets the currently used read endpoint. Useful for troubleshooting purposes.
     *
     * The url may contain a region suffix (e.g. "-eastus") if we're using location specific endpoints.
     */
    getReadEndpoint(): Promise<string>;
    /**
     * Used for reading, updating, or deleting a existing database by id or accessing containers belonging to that database.
     *
     * This does not make a network call. Use `.read` to get info about the database after getting the {@link Database} object.
     *
     * @param id The id of the database.
     * @example Create a new container off of an existing database
     * ```typescript
     * const container = client.database("<database id>").containers.create("<container id>");
     * ```
     *
     * @example Delete an existing database
     * ```typescript
     * await client.database("<id here>").delete();
     * ```
     */
    database(id: string): Database;
    /**
     * Used for reading, or updating a existing offer by id.
     * @param id The id of the offer.
     */
    offer(id: string): Offer;
}

export declare interface CosmosClientOptions {
    /** The service endpoint to use to create the client. */
    endpoint: string;
    /** The account master or readonly key (alias of auth.key) */
    key?: string;
    /** An object that is used for authenticating requests and must contains one of the options */
    auth?: AuthOptions;
    /** An instance of {@link ConnectionPolicy} class.
     * This parameter is optional and the default connectionPolicy will be used if omitted.
     */
    connectionPolicy?: ConnectionPolicy;
    /** An optional parameter that represents the consistency level.
     * It can take any value from {@link ConsistencyLevel}.
     */
    consistencyLevel?: keyof typeof ConsistencyLevel;
    defaultHeaders?: CosmosHeaders_2;
    /** An optional custom http(s) Agent to be used in NodeJS enironments
     * Use an agent such as https://github.com/TooTallNate/node-proxy-agent if you need to connect to Cosmos via a proxy
     */
    agent?: Agent;
    plugins?: PluginConfig[];
}

export declare interface CosmosHeaders {
    [key: string]: any;
}

declare interface CosmosHeaders_2 {
    [key: string]: string | boolean | number;
}

/** Defines a target data type of an index path specification in the Azure Cosmos DB service. */
export declare enum DataType {
    /** Represents a numeric data type. */
    Number = "Number",
    /** Represents a string data type. */
    String = "String",
    /** Represents a point data type. */
    Point = "Point",
    /** Represents a line string data type. */
    LineString = "LineString",
    /** Represents a polygon data type. */
    Polygon = "Polygon",
    /** Represents a multi-polygon data type. */
    MultiPolygon = "MultiPolygon"
}

/**
 * Operations for reading or deleting an existing database.
 *
 * @see {@link Databases} for creating new databases, and reading/querying all databases; use `client.databases`.
 *
 * Note: all these operations make calls against a fixed budget.
 * You should design your system such that these calls scale sublinearly with your application.
 * For instance, do not call `database.read()` before every single `item.read()` call, to ensure the database exists;
 * do this once on application start up.
 */
export declare class Database {
    readonly client: CosmosClient;
    readonly id: string;
    private clientContext;
    /**
     * Used for creating new containers, or querying/reading all containers.
     *
     * Use `.container(id)` to read, replace, or delete a specific, existing {@link Database} by id.
     *
     * @example Create a new container
     * ```typescript
     * const {body: containerDefinition, container} = await client.database("<db id>").containers.create({id: "<container id>"});
     * ```
     */
    readonly containers: Containers;
    /**
     * Used for creating new users, or querying/reading all users.
     *
     * Use `.user(id)` to read, replace, or delete a specific, existing {@link User} by id.
     */
    readonly users: Users;
    /**
     * Returns a reference URL to the resource. Used for linking in Permissions.
     */
    readonly url: string;
    /** Returns a new {@link Database} instance.
     *
     * Note: the intention is to get this object from {@link CosmosClient} via `client.database(id)`, not to instantiate it yourself.
     */
    constructor(client: CosmosClient, id: string, clientContext: ClientContext);
    /**
     * Used to read, replace, or delete a specific, existing {@link Database} by id.
     *
     * Use `.containers` creating new containers, or querying/reading all containers.
     *
     * @example Delete a container
     * ```typescript
     * await client.database("<db id>").container("<container id>").delete();
     * ```
     */
    container(id: string): Container;
    /**
     * Used to read, replace, or delete a specific, existing {@link User} by id.
     *
     * Use `.users` for creating new users, or querying/reading all users.
     */
    user(id: string): User;
    /** Read the definition of the given Database. */
    read(options?: RequestOptions): Promise<DatabaseResponse>;
    /** Delete the given Database. */
    delete(options?: RequestOptions): Promise<DatabaseResponse>;
}

/**
 * Represents a DatabaseAccount in the Azure Cosmos DB database service.
 */
export declare class DatabaseAccount {
    /** The list of writable locations for a geo-replicated database account. */
    readonly writableLocations: Location[];
    /** The list of readable locations for a geo-replicated database account. */
    readonly readableLocations: Location[];
    /** The self-link for Databases in the databaseAccount. */
    readonly DatabasesLink: string;
    /** The self-link for Media in the databaseAccount. */
    readonly MediaLink: string;
    /** Attachment content (media) storage quota in MBs ( Retrieved from gateway ). */
    readonly MaxMediaStorageUsageInMB: number;
    /**
     * Current attachment content (media) usage in MBs (Retrieved from gateway )
     *
     * Value is returned from cached information updated periodically and is not guaranteed
     * to be real time.
     */
    readonly CurrentMediaStorageUsageInMB: number;
    /** Gets the UserConsistencyPolicy settings. */
    readonly ConsistencyPolicy: ConsistencyLevel;
    readonly enableMultipleWritableLocations: boolean;
    constructor(body: {
        [key: string]: any;
    }, headers: CosmosHeaders);
}

export declare interface DatabaseDefinition {
    /** The id of the database. */
    id?: string;
}

declare interface DatabaseRequest extends DatabaseDefinition {
    /** Throughput for this database. */
    throughput?: number;
}

/** Response object for Database operations */
export declare class DatabaseResponse extends ResourceResponse<DatabaseDefinition & Resource> {
    constructor(resource: DatabaseDefinition & Resource, headers: CosmosHeaders, statusCode: number, database: Database);
    /** A reference to the {@link Database} that the returned {@link DatabaseDefinition} corresponds to. */
    readonly database: Database;
}

/**
 * Operations for creating new databases, and reading/querying all databases
 *
 * @see {@link Database} for reading or deleting an existing database; use `client.database(id)`.
 *
 * Note: all these operations make calls against a fixed budget.
 * You should design your system such that these calls scale sublinearly with your application.
 * For instance, do not call `databases.readAll()` before every single `item.read()` call, to ensure the database exists;
 * do this once on application start up.
 */
export declare class Databases {
    readonly client: CosmosClient;
    private readonly clientContext;
    /**
     * @hidden
     * @param client The parent {@link CosmosClient} for the Database.
     */
    constructor(client: CosmosClient, clientContext: ClientContext);
    /**
     * Queries all databases.
     * @param query Query configuration for the operation. See {@link SqlQuerySpec} for more info on how to configure a query.
     * @param options Use to set options like response page size, continuation tokens, etc.
     * @returns {@link QueryIterator} Allows you to return all databases in an array or iterate over them one at a time.
     * @example Read all databases to array.
     * ```typescript
     * const querySpec: SqlQuerySpec = {
     *   query: "SELECT * FROM root r WHERE r.id = @db",
     *   parameters: [
     *     {name: "@db", value: "Todo"}
     *   ]
     * };
     * const {body: databaseList} = await client.databases.query(querySpec).toArray();
     * ```
     */
    query(query: string | SqlQuerySpec, options?: FeedOptions): QueryIterator<any>;
    /**
     * Queries all databases.
     * @param query Query configuration for the operation. See {@link SqlQuerySpec} for more info on how to configure a query.
     * @param options Use to set options like response page size, continuation tokens, etc.
     * @returns {@link QueryIterator} Allows you to return all databases in an array or iterate over them one at a time.
     * @example Read all databases to array.
     * ```typescript
     * const querySpec: SqlQuerySpec = {
     *   query: "SELECT * FROM root r WHERE r.id = @db",
     *   parameters: [
     *     {name: "@db", value: "Todo"}
     *   ]
     * };
     * const {body: databaseList} = await client.databases.query(querySpec).toArray();
     * ```
     */
    query<T>(query: string | SqlQuerySpec, options?: FeedOptions): QueryIterator<T>;
    /**
     * Send a request for creating a database.
     *
     * A database manages users, permissions and a set of containers.
     * Each Azure Cosmos DB Database Account is able to support multiple independent named databases,
     * with the database being the logical container for data.
     *
     * Each Database consists of one or more containers, each of which in turn contain one or more
     * documents. Since databases are an administrative resource, the Service Master Key will be
     * required in order to access and successfully complete any action using the User APIs.
     *
     * @param body The {@link DatabaseDefinition} that represents the {@link Database} to be created.
     * @param options Use to set options like response page size, continuation tokens, etc.
     */
    create(body: DatabaseRequest, options?: RequestOptions): Promise<DatabaseResponse>;
    /**
     * Check if a database exists, and if it doesn't, create it.
     * This will make a read operation based on the id in the `body`, then if it is not found, a create operation.
     *
     * A database manages users, permissions and a set of containers.
     * Each Azure Cosmos DB Database Account is able to support multiple independent named databases,
     * with the database being the logical container for data.
     *
     * Each Database consists of one or more containers, each of which in turn contain one or more
     * documents. Since databases are an an administrative resource, the Service Master Key will be
     * required in order to access and successfully complete any action using the User APIs.
     *
     * @param body The {@link DatabaseDefinition} that represents the {@link Database} to be created.
     * @param options
     */
    createIfNotExists(body: DatabaseRequest, options?: RequestOptions): Promise<DatabaseResponse>;
    /**
     * Reads all databases.
     * @param options Use to set options like response page size, continuation tokens, etc.
     * @returns {@link QueryIterator} Allows you to return all databases in an array or iterate over them one at a time.
     * @example Read all databases to array.
     * ```typescript
     * const {body: databaseList} = await client.databases.readAll().toArray();
     * ```
     */
    readAll(options?: FeedOptions): QueryIterator<DatabaseDefinition & Resource>;
}

declare interface ErrorBody {
    code: string;
    message: string;
    additionalErrorInfo?: PartitionedQueryExecutionInfo;
}

export declare interface ErrorResponse {
    code?: number;
    substatus?: number;
    body?: ErrorBody;
    headers?: CosmosHeaders;
    activityId?: string;
    retryAfterInMilliseconds?: number;
    [key: string]: any;
}

/**
 * The feed options and query methods.
 */
export declare interface FeedOptions extends SharedOptions {
    /** Opaque token for continuing the enumeration. */
    continuation?: string;
    /**
     * DisableRUPerMinuteUsage is used to enable/disable Request Units(RUs)/minute capacity to serve
     * the request if regular provisioned RUs/second is exhausted.
     */
    disableRUPerMinuteUsage?: boolean;
    /**
     * A value indicating whether users are enabled to send more than one request to execute the query in the Azure Cosmos DB database service.
     *
     * More than one request is necessary if the query is not scoped to single partition key value.
     */
    enableCrossPartitionQuery?: boolean;
    /** Allow scan on the queries which couldn't be served as indexing was opted out on the requested paths. */
    enableScanInQuery?: boolean;
    /**
     * The maximum number of concurrent operations that run client side during parallel query execution in the
     * Azure Cosmos DB database service. Negative values make the system automatically decides the number of
     * concurrent operations to run.
     */
    maxDegreeOfParallelism?: number;
    /** Max number of items to be returned in the enumeration operation. */
    maxItemCount?: number;
    /** Indicates a change feed request. Must be set to "Incremental feed", or omitted otherwise. */
    useIncrementalFeed?: boolean;
    /** Conditions Associated with the request. */
    accessCondition?: {
        /** Conditional HTTP method header type (IfMatch or IfNoneMatch). */
        type: string;
        /** Conditional HTTP method header value (the _etag field from the last version you read). */
        condition: string;
    };
    /** Enable returning query metrics in response headers */
    populateQueryMetrics?: boolean;
}

export declare class FeedResponse<TResource> {
    readonly resources: TResource[];
    private readonly headers;
    readonly hasMoreResults: boolean;
    constructor(resources: TResource[], headers: CosmosHeaders, hasMoreResults: boolean);
    readonly continuation: string;
    readonly queryMetrics: string;
    readonly requestCharge: number;
    readonly activityId: string;
}

/** @hidden */
declare type FetchFunctionCallback = (options: any) => Promise<Response<any>>;

/**
 * @hidden
 * This internal class implements the logic for endpoint management for geo-replicated database accounts.
 * @property {object} client                       - The document client instance.
 * @property {string} defaultEndpoint              - The endpoint used to create the client instance.
 * @property {bool} enableEndpointDiscovery        - Flag to enable/disable automatic redirecting of requests
 *                                                   based on read/write operations.
 * @property {Array} preferredLocations            - List of azure regions to be used as preferred locations
 *                                                   for read requests.
 * @property {bool} isEndpointCacheInitialized     - Flag to determine whether the endpoint cache is initialized or not.
 */
declare class GlobalEndpointManager {
    private readDatabaseAccount;
    private defaultEndpoint;
    enableEndpointDiscovery: boolean;
    private isEndpointCacheInitialized;
    private locationCache;
    private isRefreshing;
    private readonly backgroundRefreshTimeIntervalInMS;
    /**
     * @constructor GlobalEndpointManager
     * @param {object} options                          - The document client instance.
     */
    constructor(options: CosmosClientOptions, readDatabaseAccount: (opts: RequestOptions) => Promise<ResourceResponse<DatabaseAccount>>);
    /**
     * Gets the current read endpoint from the endpoint cache.
     */
    getReadEndpoint(): Promise<string>;
    /**
     * Gets the current write endpoint from the endpoint cache.
     */
    getWriteEndpoint(): Promise<string>;
    getReadEndpoints(): Promise<ReadonlyArray<string>>;
    getWriteEndpoints(): Promise<ReadonlyArray<string>>;
    markCurrentLocationUnavailableForRead(endpoint: string): void;
    markCurrentLocationUnavailableForWrite(endpoint: string): void;
    canUseMultipleWriteLocations(resourceType?: ResourceType, operationType?: OperationType): boolean;
    resolveServiceEndpoint(request: RequestContext): Promise<string>;
    /**
     * Refreshes the endpoint list by retrieving the writable and readable locations
     *  from the geo-replicated database account and then updating the locations cache.
     *   We skip the refreshing if enableEndpointDiscovery is set to False
     */
    refreshEndpointList(): Promise<void>;
    private backgroundRefresh;
    /**
     * Gets the database account first by using the default endpoint, and if that doesn't returns
     * use the endpoints for the preferred locations in the order they are specified to get
     * the database account.
     * @memberof GlobalEndpointManager
     * @instance
     * @param {function} callback        - The callback function which takes databaseAccount(object) as an argument.
     */
    private getDatabaseAccountFromAnyEndpoint;
    /**
     * Gets the locational endpoint using the location name passed to it using the default endpoint.
     * @memberof GlobalEndpointManager
     * @instance
     * @param {string} defaultEndpoint - The default endpoint to use for the endpoint.
     * @param {string} locationName    - The location name for the azure region like "East US".
     */
    private static getLocationalEndpoint;
}

declare enum HTTPMethod {
    get = "GET",
    post = "POST",
    put = "PUT",
    delete = "DELETE"
}

export declare interface Index {
    kind: keyof typeof IndexKind;
    dataType: keyof typeof DataType;
    precision?: number;
}

/**
 * Specifies the supported Index types.
 */
export declare enum IndexKind {
    /**
     * This is supplied for a path which has no sorting requirement. This kind of an index has better precision than corresponding range index.
     */
    Hash = "Hash",
    /**
     * This is supplied for a path which requires sorting.
     */
    Range = "Range",
    /**
     * This is supplied for a path which requires geospatial indexing.
     */
    Spatial = "Spatial"
}

export declare interface IndexedPath {
    path: string;
    indexes?: Index[];
}

/**
 * Specifies the supported indexing modes.
 * @property Consistent
 * @property Lazy
 */
export declare enum IndexingMode {
    /**
     * Index is updated synchronously with a create or update operation.
     *
     * With consistent indexing, query behavior is the same as the default consistency level for the container.
     * The index is always kept up to date with the data.
     */
    consistent = "consistent",
    /**
     * Index is updated asynchronously with respect to a create or update operation.
     *
     * With lazy indexing, queries are eventually consistent. The index is updated when the container is idle.
     */
    lazy = "lazy",
    /** No Index is provided. */
    none = "none"
}

export declare interface IndexingPolicy {
    /** The indexing mode (consistent or lazy) {@link IndexingMode}. */
    indexingMode?: keyof typeof IndexingMode;
    automatic?: boolean;
    /** An array of {@link IncludedPath} represents the paths to be included for indexing. */
    includedPaths?: IndexedPath[];
    /** An array of {@link IncludedPath} represents the paths to be excluded for indexing. */
    excludedPaths?: IndexedPath[];
}

/**
 * Used to perform operations on a specific item.
 *
 * @see {@link Items} for operations on all items; see `container.items`.
 */
export declare class Item {
    readonly container: Container;
    readonly id: string;
    readonly partitionKey: string;
    private readonly clientContext;
    /**
     * Returns a reference URL to the resource. Used for linking in Permissions.
     */
    readonly url: string;
    /**
     * @hidden
     * @param container The parent {@link Container}.
     * @param id The id of the given {@link Item}.
     * @param partitionKey The primary key of the given {@link Item} (only for partitioned containers).
     */
    constructor(container: Container, id: string, partitionKey: string, clientContext: ClientContext);
    /**
     * Read the item's definition.
     *
     * There is no set schema for JSON items. They may contain any number of custom properties.
     *
     * @param options Additional options for the request, such as the partition key.
     * Note, if you provide a partition key on the options object, it will override the primary key on `this.partitionKey`.
     */
    read(options?: RequestOptions): Promise<ItemResponse<ItemDefinition>>;
    /**
     * Read the item's definition.
     *
     * Any provided type, T, is not necessarily enforced by the SDK.
     * You may get more or less properties and it's up to your logic to enforce it.
     * If the type, T, is a class, it won't pass `typeof` comparisons, because it won't have a match prototype.
     * It's recommended to only use interfaces.
     *
     * There is no set schema for JSON items. They may contain any number of custom properties.
     *
     * @param options Additional options for the request, such as the partition key.
     * Note, if you provide a partition key on the options object, it will override the primary key on `this.partitionKey`.
     *
     * @example Using custom type for response
     * ```typescript
     * interface TodoItem {
     *   title: string;
     *   done: bool;
     *   id: string;
     * }
     *
     * let item: TodoItem;
     * ({body: item} = await item.read<TodoItem>());
     * ```
     */
    read<T extends ItemDefinition>(options?: RequestOptions): Promise<ItemResponse<T>>;
    /**
     * Replace the item's definition.
     *
     * There is no set schema for JSON items. They may contain any number of custom properties.
     *
     * @param body The definition to replace the existing {@link Item}'s definition with.
     * @param options Additional options for the request, such as the partition key.
     */
    replace(body: ItemDefinition, options?: RequestOptions): Promise<ItemResponse<ItemDefinition>>;
    /**
     * Replace the item's definition.
     *
     * Any provided type, T, is not necessarily enforced by the SDK.
     * You may get more or less properties and it's up to your logic to enforce it.
     *
     * There is no set schema for JSON items. They may contain any number of custom properties.
     *
     * @param body The definition to replace the existing {@link Item}'s definition with.
     * @param options Additional options for the request, such as the partition key.
     */
    replace<T extends ItemDefinition>(body: T, options?: RequestOptions): Promise<ItemResponse<T>>;
    /**
     * Delete the item.
     * @param options Additional options for the request, such as the partition key.
     */
    delete(options?: RequestOptions): Promise<ItemResponse<ItemDefinition>>;
    /**
     * Delete the item.
     *
     * Any provided type, T, is not necessarily enforced by the SDK.
     * You may get more or less properties and it's up to your logic to enforce it.
     *
     * @param options Additional options for the request, such as the partition key.
     */
    delete<T extends ItemDefinition>(options?: RequestOptions): Promise<ItemResponse<T>>;
}

/**
 * Items in Cosmos DB are simply JSON objects.
 * Most of the Item operations allow for your to provide your own type
 * that extends the very simple ItemDefinition.
 *
 * You cannot use any reserved keys. You can see the reserved key list
 * in {@link ItemBody}
 */
export declare interface ItemDefinition {
    [key: string]: any;
}

export declare class ItemResponse<T extends ItemDefinition> extends ResourceResponse<T & Resource> {
    constructor(resource: T & Resource, headers: CosmosHeaders, statusCode: number, item: Item);
    /** Reference to the {@link Item} the response corresponds to. */
    readonly item: Item;
}

/**
 * Operations for creating new items, and reading/querying all items
 *
 * @see {@link Item} for reading, replacing, or deleting an existing container; use `.item(id)`.
 */
export declare class Items {
    readonly container: Container;
    private readonly clientContext;
    /**
     * Create an instance of {@link Items} linked to the parent {@link Container}.
     * @param container The parent container.
     * @hidden
     */
    constructor(container: Container, clientContext: ClientContext);
    /**
     * Queries all items.
     * @param query Query configuration for the operation. See {@link SqlQuerySpec} for more info on how to configure a query.
     * @param options Used for modifying the request (for instance, specifying the partition key).
     * @example Read all items to array.
     * ```typescript
     * const querySpec: SqlQuerySpec = {
     *   query: "SELECT * FROM Families f WHERE f.lastName = @lastName",
     *   parameters: [
     *     {name: "@lastName", value: "Hendricks"}
     *   ]
     * };
     * const {result: items} = await items.query(querySpec).toArray();
     * ```
     */
    query(query: string | SqlQuerySpec, options?: FeedOptions): QueryIterator<any>;
    /**
     * Queries all items.
     * @param query Query configuration for the operation. See {@link SqlQuerySpec} for more info on how to configure a query.
     * @param options Used for modifying the request (for instance, specifying the partition key).
     * @example Read all items to array.
     * ```typescript
     * const querySpec: SqlQuerySpec = {
     *   query: "SELECT firstname FROM Families f WHERE f.lastName = @lastName",
     *   parameters: [
     *     {name: "@lastName", value: "Hendricks"}
     *   ]
     * };
     * const {result: items} = await items.query<{firstName: string}>(querySpec).toArray();
     * ```
     */
    query<T>(query: string | SqlQuerySpec, options?: FeedOptions): QueryIterator<T>;
    /**
     * Create a `ChangeFeedIterator` to iterate over pages of changes
     *
     * @param partitionKey
     * @param changeFeedOptions
     *
     * @example Read from the beginning of the change feed.
     * ```javascript
     * const iterator = items.readChangeFeed({ startFromBeginning: true });
     * const firstPage = await iterator.executeNext();
     * const firstPageResults = firstPage.result
     * const secondPage = await iterator.executeNext();
     * ```
     */
    readChangeFeed(partitionKey: string | number | boolean, changeFeedOptions: ChangeFeedOptions): ChangeFeedIterator<any>;
    /**
     * Create a `ChangeFeedIterator` to iterate over pages of changes
     *
     * @param changeFeedOptions
     */
    readChangeFeed(changeFeedOptions?: ChangeFeedOptions): ChangeFeedIterator<any>;
    /**
     * Create a `ChangeFeedIterator` to iterate over pages of changes
     *
     * @param partitionKey
     * @param changeFeedOptions
     */
    readChangeFeed<T>(partitionKey: string | number | boolean, changeFeedOptions: ChangeFeedOptions): ChangeFeedIterator<T>;
    /**
     * Create a `ChangeFeedIterator` to iterate over pages of changes
     *
     * @param changeFeedOptions
     */
    readChangeFeed<T>(changeFeedOptions?: ChangeFeedOptions): ChangeFeedIterator<T>;
    /**
     * Read all items.
     *
     * There is no set schema for JSON items. They may contain any number of custom properties.
     *
     * @param options Used for modifying the request (for instance, specifying the partition key).
     * @example Read all items to array.
     * ```typescript
     * const {body: containerList} = await items.readAll().toArray();
     * ```
     */
    readAll(options?: FeedOptions): QueryIterator<ItemDefinition>;
    /**
     * Read all items.
     *
     * Any provided type, T, is not necessarily enforced by the SDK.
     * You may get more or less properties and it's up to your logic to enforce it.
     *
     * There is no set schema for JSON items. They may contain any number of custom properties.
     *
     * @param options Used for modifying the request (for instance, specifying the partition key).
     * @example Read all items to array.
     * ```typescript
     * const {body: containerList} = await items.readAll().toArray();
     * ```
     */
    readAll<T extends ItemDefinition>(options?: FeedOptions): QueryIterator<T>;
    /**
     * Create a item.
     *
     * Any provided type, T, is not necessarily enforced by the SDK.
     * You may get more or less properties and it's up to your logic to enforce it.
     *
     * There is no set schema for JSON items. They may contain any number of custom properties.
     *
     * @param body Represents the body of the item. Can contain any number of user defined properties.
     * @param options Used for modifying the request (for instance, specifying the partition key).
     */
    create<T extends ItemDefinition = any>(body: T, options?: RequestOptions): Promise<ItemResponse<T>>;
    /**
     * Upsert an item.
     *
     * There is no set schema for JSON items. They may contain any number of custom properties.
     *
     * @param body Represents the body of the item. Can contain any number of user defined properties.
     * @param options Used for modifying the request (for instance, specifying the partition key).
     */
    upsert(body: any, options?: RequestOptions): Promise<ItemResponse<ItemDefinition>>;
    /**
     * Upsert an item.
     *
     * Any provided type, T, is not necessarily enforced by the SDK.
     * You may get more or less properties and it's up to your logic to enforce it.
     *
     * There is no set schema for JSON items. They may contain any number of custom properties.
     *
     * @param body Represents the body of the item. Can contain any number of user defined properties.
     * @param options Used for modifying the request (for instance, specifying the partition key).
     */
    upsert<T extends ItemDefinition>(body: T, options?: RequestOptions): Promise<ItemResponse<T>>;
}

/**
 * Used to specify the locations that are available, read is index 1 and write is index 0.
 */
export declare interface Location {
    name: string;
    databaseAccountEndpoint: string;
}

declare class LocationRouting {
    private pIgnorePreferredLocation;
    private pLocationIndexToRoute;
    private pLocationEndpointToRoute;
    readonly ignorePreferredLocation: boolean;
    readonly locationIndexToRoute: number;
    readonly locationEndpointToRoute: string;
    routeToLocation(locationEndpoint: string): void;
    routeToLocation(locationIndex: number, ignorePreferredLocation: boolean): void;
    clearRouteToLocation(): void;
}

/**
 * Next is a function which takes in requestContext returns a promise. You must await/then that promise which will contain the response from further plugins,
 * allowing you to log those results or handle errors.
 */
export declare type Next<T> = (context: RequestContext) => Promise<Response<T>>;

/**
 * Use to read or replace an existing {@link Offer} by id.
 *
 * @see {@link Offers} to query or read all offers.
 */
export declare class Offer {
    readonly client: CosmosClient;
    readonly id: string;
    private readonly clientContext;
    /**
     * Returns a reference URL to the resource. Used for linking in Permissions.
     */
    readonly url: string;
    /**
     * @hidden
     * @param client The parent {@link CosmosClient} for the Database Account.
     * @param id The id of the given {@link Offer}.
     */
    constructor(client: CosmosClient, id: string, clientContext: ClientContext);
    /**
     * Read the {@link OfferDefinition} for the given {@link Offer}.
     * @param options
     */
    read(options?: RequestOptions): Promise<OfferResponse>;
    /**
     * Replace the given {@link Offer} with the specified {@link OfferDefinition}.
     * @param body The specified {@link OfferDefinition}
     * @param options
     */
    replace(body: OfferDefinition, options?: RequestOptions): Promise<OfferResponse>;
}

export declare interface OfferDefinition {
    id?: string;
    offerType?: string;
    offerVersion?: string;
    resource?: string;
    offerResourceId?: string;
    content?: {
        offerThroughput: number;
        offerIsRUPerMinuteThroughputEnabled: boolean;
    };
}

export declare class OfferResponse extends ResourceResponse<OfferDefinition & Resource> {
    constructor(resource: OfferDefinition & Resource, headers: CosmosHeaders, statusCode: number, offer: Offer);
    /** A reference to the {@link Offer} corresponding to the returned {@link OfferDefinition}. */
    readonly offer: Offer;
}

/**
 * Use to query or read all Offers.
 *
 * @see {@link Offer} to read or replace an existing {@link Offer} by id.
 */
export declare class Offers {
    readonly client: CosmosClient;
    private readonly clientContext;
    /**
     * @hidden
     * @param client The parent {@link CosmosClient} for the offers.
     */
    constructor(client: CosmosClient, clientContext: ClientContext);
    /**
     * Query all offers.
     * @param query Query configuration for the operation. See {@link SqlQuerySpec} for more info on how to configure a query.
     * @param options
     */
    query(query: SqlQuerySpec, options?: FeedOptions): QueryIterator<any>;
    /**
     * Query all offers.
     * @param query Query configuration for the operation. See {@link SqlQuerySpec} for more info on how to configure a query.
     * @param options
     */
    query<T>(query: SqlQuerySpec, options?: FeedOptions): QueryIterator<T>;
    /**
     * Read all offers.
     * @param options
     * @example Read all offers to array.
     * ```typescript
     * const {body: offerList} = await client.offers.readAll().toArray();
     * ```
     */
    readAll(options?: FeedOptions): QueryIterator<OfferDefinition & Resource>;
}

declare enum OperationType {
    Create = "create",
    Replace = "replace",
    Upsert = "upsert",
    Delete = "delete",
    Read = "read",
    Query = "query",
    Execute = "execute"
}

export declare type PartitionKey = PartitionKeyDefinition | Point | Range;

export declare interface PartitionKeyDefinition {
    paths: string[];
    kind: keyof typeof PartitionKind;
    version?: number;
}

export declare interface PartitionKeyRange {
    id: string;
    minInclusive: string;
    maxExclusive: string;
    ridPrefix: number;
    throughputFraction: number;
    status: string;
    parents: string[];
}

export declare enum PartitionKind {
    Hash = "Hash"
}

declare interface PartitionedQueryExecutionInfo {
    partitionedQueryExecutionInfoVersion: number;
    queryInfo: QueryInfo;
    queryRanges: QueryRange[];
}

/**
 * Use to read, replace, or delete a given {@link Permission} by id.
 *
 * @see {@link Permissions} to create, upsert, query, or read all Permissions.
 */
export declare class Permission {
    readonly user: User;
    readonly id: string;
    private readonly clientContext;
    /**
     * Returns a reference URL to the resource. Used for linking in Permissions.
     */
    readonly url: string;
    /**
     * @hidden
     * @param user The parent {@link User}.
     * @param id The id of the given {@link Permission}.
     */
    constructor(user: User, id: string, clientContext: ClientContext);
    /**
     * Read the {@link PermissionDefinition} of the given {@link Permission}.
     * @param options
     */
    read(options?: RequestOptions): Promise<PermissionResponse>;
    /**
     * Replace the given {@link Permission} with the specified {@link PermissionDefinition}.
     * @param body The specified {@link PermissionDefinition}.
     * @param options
     */
    replace(body: PermissionDefinition, options?: RequestOptions): Promise<PermissionResponse>;
    /**
     * Delete the given {@link Permission}.
     * @param options
     */
    delete(options?: RequestOptions): Promise<PermissionResponse>;
}

declare interface PermissionBody {
    /** System generated resource token for the particular resource and user */
    _token: string;
}

export declare interface PermissionDefinition {
    /** The id of the permission */
    id: string;
    /** The mode of the permission, must be a value of {@link PermissionMode} */
    permissionMode: PermissionMode;
    /** The link of the resource that the permission will be applied to. */
    resource: string;
    resourcePartitionKey?: string | any[];
}

/**
 * Enum for permission mode values.
 */
export declare enum PermissionMode {
    /** Permission not valid. */
    None = "none",
    /** Permission applicable for read operations only. */
    Read = "read",
    /** Permission applicable for all operations. */
    All = "all"
}

export declare class PermissionResponse extends ResourceResponse<PermissionDefinition & PermissionBody & Resource> {
    constructor(resource: PermissionDefinition & PermissionBody & Resource, headers: CosmosHeaders, statusCode: number, permission: Permission);
    /** A reference to the {@link Permission} corresponding to the returned {@link PermissionDefinition}. */
    readonly permission: Permission;
}

/**
 * Use to create, replace, query, and read all Permissions.
 *
 * @see {@link Permission} to read, replace, or delete a specific permission by id.
 */
export declare class Permissions {
    readonly user: User;
    private readonly clientContext;
    /**
     * @hidden
     * @param user The parent {@link User}.
     */
    constructor(user: User, clientContext: ClientContext);
    /**
     * Query all permissions.
     * @param query Query configuration for the operation. See {@link SqlQuerySpec} for more info on how to configure a query.
     * @param options
     */
    query(query: SqlQuerySpec, options?: FeedOptions): QueryIterator<any>;
    /**
     * Query all permissions.
     * @param query Query configuration for the operation. See {@link SqlQuerySpec} for more info on how to configure a query.
     * @param options
     */
    query<T>(query: SqlQuerySpec, options?: FeedOptions): QueryIterator<T>;
    /**
     * Read all permissions.
     * @param options
     * @example Read all permissions to array.
     * ```typescript
     * const {body: permissionList} = await user.permissions.readAll().toArray();
     * ```
     */
    readAll(options?: FeedOptions): QueryIterator<PermissionDefinition & Resource>;
    /**
     * Create a permission.
     *
     * A permission represents a per-User Permission to access a specific resource
     * e.g. Item or Container.
     * @param body Represents the body of the permission.
     */
    create(body: PermissionDefinition, options?: RequestOptions): Promise<PermissionResponse>;
    /**
     * Upsert a permission.
     *
     * A permission represents a per-User Permission to access a
     * specific resource e.g. Item or Container.
     */
    upsert(body: PermissionDefinition, options?: RequestOptions): Promise<PermissionResponse>;
}

/**
 * Plugins allow you to customize the behavior of the SDk with additional logging, retry, or additional functionality.
 *
 * A plugin is a function which returns a Promise<Response<T>>, and is passed a RequestContext and Next object.
 *
 * Next is a function which takes in requestContext returns a promise. You must await/then that promise which will contain the response from further plugins,
 * allowing you to log those results or handle errors.
 *
 * RequestContext is an object which controls what operation is happening, against which endpoint, and more. Modifying this and passing it along via next is how
 * you modify future SDK behavior.
 */
export declare type Plugin<T> = (context: RequestContext, next: Next<T>) => Promise<Response<T>>;

/**
 * Specifies which event to run for the specified plugin
 */
export declare interface PluginConfig {
    /**
     * The event to run the plugin on
     */
    on: keyof typeof PluginOn;
    /**
     * The plugin to run
     */
    plugin: Plugin<any>;
}

/**
 * Used to specify which type of events to execute this plug in on.
 */
export declare enum PluginOn {
    /**
     * Will be executed per network request
     */
    request = "request",
    /**
     * Will be executed per API operation
     */
    operation = "operation"
}

/** @hidden */
declare type Point = number | string;

declare interface QueryInfo {
    top?: any;
    orderBy?: any[];
    orderByExpressions?: any[];
    offset?: number;
    limit?: number;
    aggregates?: any[];
    rewrittenQuery?: any;
    distinctType: string;
}

/**
 * Represents a QueryIterator Object, an implmenetation of feed or query response that enables
 * traversal and iterating over the response
 * in the Azure Cosmos DB database service.
 */
export declare class QueryIterator<T> {
    private clientContext;
    private query;
    private options;
    private fetchFunctions;
    private resourceLink?;
    private fetchAllTempResources;
    private fetchAllLastResHeaders;
    private queryExecutionContext;
    /**
     * @hidden
     */
    constructor(clientContext: ClientContext, query: SqlQuerySpec | string, options: FeedOptions, fetchFunctions: FetchFunctionCallback | FetchFunctionCallback[], resourceLink?: string);
    /**
     * Calls a specified callback for each item returned from the query.
     * Runs serially; each callback blocks the next.
     *
     * @param callback Specified callback.
     * First param is the result,
     * second param (optional) is the current headers object state,
     * third param (optional) is current index.
     * No more callbacks will be called if one of them results false.
     *
     * @returns Promise<void> - you should await or .catch the Promise in case there are any errors
     *
     * @example Iterate over all databases
     * ```typescript
     * await client.databases.readAll().forEach((db, headers, index) => {
     *   console.log(`Got ${db.id} from forEach`);
     * })
     * ```
     */
    forEach(callback: (result: T, headers?: CosmosHeaders, index?: number) => boolean | void): Promise<void>;
    /**
     * Gets an async iterator that will yield results until completion.
     *
     * NOTE: AsyncIterators are a very new feature and you might need to
     * use polyfils/etc. in order to use them in your code.
     *
     * If you're using TypeScript, you can use the following polyfill as long
     * as you target ES6 or higher and are running on Node 6 or higher.
     *
     * ```typescript
     * if (!Symbol || !Symbol.asyncIterator) {
     *   (Symbol as any).asyncIterator = Symbol.for("Symbol.asyncIterator");
     * }
     * ```
     *
     * @see QueryIterator.forEach for very similar functionality.
     *
     * @example Iterate over all databases
     * ```typescript
     * for await(const {result: db} in client.databases.readAll().getAsyncIterator()) {
     *   console.log(`Got ${db.id} from AsyncIterator`);
     * }
     * ```
     */
    getAsyncIterator(): AsyncIterable<FeedResponse<T>>;
    /**
     * Determine if there are still remaining resources to processs based on the value of the continuation token or the\
     * elements remaining on the current batch in the QueryIterator.
     * @returns {Boolean} true if there is other elements to process in the QueryIterator.
     */
    hasMoreResults(): boolean;
    /**
     * Fetch all pages for the query and return a single FeedResponse.
     */
    fetchAll(): Promise<FeedResponse<T>>;
    /**
     * Retrieve the next batch from the feed.
     *
     * This may or may not fetch more pages from the backend depending on your settings
     * and the type of query. Aggregate queries will generally fetch all backend pages
     * before returning the first batch of responses.
     */
    fetchNext(): Promise<FeedResponse<T>>;
    /**
     * Reset the QueryIterator to the beginning and clear all the resources inside it
     */
    reset(): void;
    private toArrayImplementation;
    private createQueryExecutionContext;
}

export declare class QueryMetrics {
    readonly retrievedDocumentCount: number;
    readonly retrievedDocumentSize: number;
    readonly outputDocumentCount: number;
    readonly outputDocumentSize: number;
    readonly indexHitDocumentCount: number;
    readonly totalQueryExecutionTime: TimeSpan;
    readonly queryPreparationTimes: QueryPreparationTimes;
    readonly indexLookupTime: TimeSpan;
    readonly documentLoadTime: TimeSpan;
    readonly vmExecutionTime: TimeSpan;
    readonly runtimeExecutionTimes: RuntimeExecutionTimes;
    readonly documentWriteTime: TimeSpan;
    readonly clientSideMetrics: ClientSideMetrics;
    constructor(retrievedDocumentCount: number, retrievedDocumentSize: number, outputDocumentCount: number, outputDocumentSize: number, indexHitDocumentCount: number, totalQueryExecutionTime: TimeSpan, queryPreparationTimes: QueryPreparationTimes, indexLookupTime: TimeSpan, documentLoadTime: TimeSpan, vmExecutionTime: TimeSpan, runtimeExecutionTimes: RuntimeExecutionTimes, documentWriteTime: TimeSpan, clientSideMetrics: ClientSideMetrics);
    /**
     * Gets the IndexHitRatio
     * @memberof QueryMetrics
     * @instance
     * @ignore
     */
    readonly indexHitRatio: number;
    /**
     * returns a new QueryMetrics instance that is the addition of this and the arguments.
     */
    add(queryMetricsArray: QueryMetrics[]): QueryMetrics;
    /**
     * Output the QueryMetrics as a delimited string.
     * @memberof QueryMetrics
     * @instance
     * @ignore
     */
    toDelimitedString(): string;
    static readonly zero: QueryMetrics;
    /**
     * Returns a new instance of the QueryMetrics class that is the aggregation of an array of query metrics.
     * @memberof QueryMetrics
     * @instance
     */
    static createFromArray(queryMetricsArray: QueryMetrics[]): QueryMetrics;
    /**
     * Returns a new instance of the QueryMetrics class this is deserialized from a delimited string.
     * @memberof QueryMetrics
     * @instance
     */
    static createFromDelimitedString(delimitedString: string, clientSideMetrics?: ClientSideMetrics): QueryMetrics;
}

export declare const QueryMetricsConstants: {
    RetrievedDocumentCount: string;
    RetrievedDocumentSize: string;
    OutputDocumentCount: string;
    OutputDocumentSize: string;
    IndexHitRatio: string;
    IndexHitDocumentCount: string;
    TotalQueryExecutionTimeInMs: string;
    QueryCompileTimeInMs: string;
    LogicalPlanBuildTimeInMs: string;
    PhysicalPlanBuildTimeInMs: string;
    QueryOptimizationTimeInMs: string;
    IndexLookupTimeInMs: string;
    DocumentLoadTimeInMs: string;
    VMExecutionTimeInMs: string;
    DocumentWriteTimeInMs: string;
    QueryEngineTimes: string;
    SystemFunctionExecuteTimeInMs: string;
    UserDefinedFunctionExecutionTimeInMs: string;
    RetrievedDocumentCountText: string;
    RetrievedDocumentSizeText: string;
    OutputDocumentCountText: string;
    OutputDocumentSizeText: string;
    IndexUtilizationText: string;
    TotalQueryExecutionTimeText: string;
    QueryPreparationTimesText: string;
    QueryCompileTimeText: string;
    LogicalPlanBuildTimeText: string;
    PhysicalPlanBuildTimeText: string;
    QueryOptimizationTimeText: string;
    QueryEngineTimesText: string;
    IndexLookupTimeText: string;
    DocumentLoadTimeText: string;
    WriteOutputTimeText: string;
    RuntimeExecutionTimesText: string;
    TotalExecutionTimeText: string;
    SystemFunctionExecuteTimeText: string;
    UserDefinedFunctionExecutionTimeText: string;
    ClientSideQueryMetricsText: string;
    RetriesText: string;
    RequestChargeText: string;
    FetchExecutionRangesText: string;
    SchedulingMetricsText: string;
};

export declare class QueryPreparationTimes {
    readonly queryCompilationTime: TimeSpan;
    readonly logicalPlanBuildTime: TimeSpan;
    readonly physicalPlanBuildTime: TimeSpan;
    readonly queryOptimizationTime: TimeSpan;
    constructor(queryCompilationTime: TimeSpan, logicalPlanBuildTime: TimeSpan, physicalPlanBuildTime: TimeSpan, queryOptimizationTime: TimeSpan);
    /**
     * returns a new QueryPreparationTimes instance that is the addition of this and the arguments.
     */
    add(...queryPreparationTimesArray: QueryPreparationTimes[]): QueryPreparationTimes;
    /**
     * Output the QueryPreparationTimes as a delimited string.
     */
    toDelimitedString(): string;
    static readonly zero: QueryPreparationTimes;
    /**
     * Returns a new instance of the QueryPreparationTimes class that is the
     * aggregation of an array of QueryPreparationTimes.
     * @memberof QueryMetrics
     * @instance
     */
    static createFromArray(queryPreparationTimesArray: QueryPreparationTimes[]): QueryPreparationTimes;
    /**
     * Returns a new instance of the QueryPreparationTimes class this is deserialized from a delimited string.
     * @memberof QueryMetrics
     * @instance
     */
    static createFromDelimitedString(delimitedString: string): QueryPreparationTimes;
}

declare interface QueryRange {
    min: string;
    max: string;
    isMinInclusive: boolean;
    isMaxInclusive: boolean;
}

/** @hidden */
declare class Range {
    readonly low: Point;
    readonly high: Point;
    /**
     * Represents a range object used by the RangePartitionResolver in the Azure Cosmos DB database service.
     * @class Range
     * @param {object} options                   - The Range constructor options.
     * @param {any} options.low                  - The low value in the range.
     * @param {any} options.high                 - The high value in the range.
     */
    constructor(options?: any);
    _compare(x: Point, y: Point, compareFunction?: CompareFunction): number;
    _contains: (other: string | number | Range, compareFunction?: CompareFunction) => boolean;
    contains(other: Point | Range, compareFunction?: CompareFunction): boolean;
    _containsPoint(point: Point, compareFunction?: CompareFunction): boolean;
    _containsRange(range: Range, compareFunction?: CompareFunction): boolean;
    _intersect: (range: Range, compareFunction?: CompareFunction) => boolean;
    intersect(range: Range, compareFunction?: CompareFunction): boolean;
    _toString: () => string;
    toString(): string;
    static _isRange: typeof Range.isRange;
    static isRange(pointOrRange: Point | Range | PartitionKey): boolean;
}

export declare interface RequestContext {
    path?: string;
    operationType?: OperationType;
    client?: ClientContext;
    retryCount?: number;
    resourceType?: ResourceType;
    resourceId?: string;
    locationRouting?: LocationRouting;
    globalEndpointManager: GlobalEndpointManager;
    connectionPolicy: ConnectionPolicy;
    requestAgent: Agent;
    body?: any;
    headers?: CosmosHeaders_2;
    endpoint?: string;
    method: HTTPMethod;
    partitionKeyRangeId?: string;
    options: FeedOptions | RequestOptions;
    plugins: PluginConfig[];
}

/** @hidden */
declare interface RequestInfo {
    verb: HTTPMethod;
    path: string;
    resourceId: string;
    resourceType: ResourceType;
    headers: CosmosHeaders;
}

/**
 * Options that can be specified for a requested issued to the Azure Cosmos DB servers.=
 */
export declare interface RequestOptions extends SharedOptions {
    /** Conditions Associated with the request. */
    accessCondition?: {
        /** Conditional HTTP method header type (IfMatch or IfNoneMatch). */
        type: string;
        /** Conditional HTTP method header value (the _etag field from the last version you read). */
        condition: string;
    };
    /** Consistency level required by the client. */
    consistencyLevel?: string;
    /**
     * DisableRUPerMinuteUsage is used to enable/disable Request Units(RUs)/minute capacity
     * to serve the request if regular provisioned RUs/second is exhausted.
     */
    disableRUPerMinuteUsage?: boolean;
    /** Enables or disables logging in JavaScript stored procedures. */
    enableScriptLogging?: boolean;
    /** Specifies indexing directives (index, do not index .. etc). */
    indexingDirective?: string;
    /** The offer throughput provisioned for a container in measurement of Requests-per-Unit. */
    offerThroughput?: number;
    /**
     * Offer type when creating document containers.
     *
     * This option is only valid when creating a document container.
     */
    offerType?: string;
    /** Enables/disables getting document container quota related stats for document container read requests. */
    populateQuotaInfo?: boolean;
    /** Indicates what is the post trigger to be invoked after the operation. */
    postTriggerInclude?: string | string[];
    /** Indicates what is the pre trigger to be invoked before the operation. */
    preTriggerInclude?: string | string[];
    /** Expiry time (in seconds) for resource token associated with permission (applicable only for requests on permissions). */
    resourceTokenExpirySeconds?: number;
    /** (Advanced use case) The url to connect to. */
    urlConnection?: string;
    /** (Advanced use case) Skip getting info on the parititon key from the container. */
    skipGetPartitionKeyDefinition?: boolean;
    /** Disable automatic id generation (will cause creates to fail if id isn't on the definition) */
    disableAutomaticIdGeneration?: boolean;
}

export declare interface Resource {
    /** Required. User settable property. Unique name that identifies the item, that is, no two items share the same ID within a database. The id must not exceed 255 characters. */
    id: string;
    /** System generated property. The resource ID (_rid) is a unique identifier that is also hierarchical per the resource stack on the resource model. It is used internally for placement and navigation of the item resource. */
    _rid: string;
    /** System generated property. Specifies the last updated timestamp of the resource. The value is a timestamp. */
    _ts: number;
    /** System generated property. The unique addressable URI for the resource. */
    _self: string;
    /** System generated property. Represents the resource etag required for optimistic concurrency control. */
    _etag: string;
}

export declare class ResourceResponse<TResource> {
    readonly resource: TResource;
    readonly headers: CosmosHeaders_2;
    readonly statusCode: StatusCode;
    constructor(resource: TResource, headers: CosmosHeaders_2, statusCode: StatusCode);
    readonly requestCharge: number;
    readonly activityId: string;
    readonly etag: string;
}

declare enum ResourceType {
    none = "",
    database = "dbs",
    offer = "offers",
    user = "users",
    permission = "permissions",
    container = "colls",
    conflicts = "conflicts",
    sproc = "sprocs",
    udf = "udfs",
    trigger = "triggers",
    item = "docs",
    pkranges = "pkranges"
}

export declare interface Response<T> {
    headers: CosmosHeaders;
    result?: T;
    statusCode?: number;
}

/**
 * Represents the Retry policy assocated with throttled requests in the Azure Cosmos DB database service.
 */
export declare interface RetryOptions {
    /** Max number of retries to be performed for a request. Default value 9. */
    maxRetryAttemptCount: number;
    /** Fixed retry interval in milliseconds to wait between each retry ignoring the retryAfter returned as part of the response. */
    fixedRetryIntervalInMilliseconds: number;
    /** Max wait time in seconds to wait for a request while the retries are happening. Default value 30 seconds. */
    maxWaitTimeInSeconds: number;
}

export declare class RuntimeExecutionTimes {
    readonly queryEngineExecutionTime: TimeSpan;
    readonly systemFunctionExecutionTime: TimeSpan;
    readonly userDefinedFunctionExecutionTime: TimeSpan;
    constructor(queryEngineExecutionTime: TimeSpan, systemFunctionExecutionTime: TimeSpan, userDefinedFunctionExecutionTime: TimeSpan);
    /**
     * returns a new RuntimeExecutionTimes instance that is the addition of this and the arguments.
     */
    add(...runtimeExecutionTimesArray: RuntimeExecutionTimes[]): RuntimeExecutionTimes;
    /**
     * Output the RuntimeExecutionTimes as a delimited string.
     */
    toDelimitedString(): string;
    static readonly zero: RuntimeExecutionTimes;
    /**
     * Returns a new instance of the RuntimeExecutionTimes class that is
     *  the aggregation of an array of RuntimeExecutionTimes.
     */
    static createFromArray(runtimeExecutionTimesArray: RuntimeExecutionTimes[]): RuntimeExecutionTimes;
    /**
     * Returns a new instance of the RuntimeExecutionTimes class this is deserialized from a delimited string.
     */
    static createFromDelimitedString(delimitedString: string): RuntimeExecutionTimes;
}

declare class Scripts {
    readonly container: Container;
    private readonly clientContext;
    /**
     * @param container The parent {@link Container}.
     * @hidden
     */
    constructor(container: Container, clientContext: ClientContext);
    /**
     * Used to read, replace, or delete a specific, existing {@link StoredProcedure} by id.
     *
     * Use `.storedProcedures` for creating new stored procedures, or querying/reading all stored procedures.
     * @param id The id of the {@link StoredProcedure}.
     */
    storedProcedure(id: string): StoredProcedure;
    /**
     * Used to read, replace, or delete a specific, existing {@link Trigger} by id.
     *
     * Use `.triggers` for creating new triggers, or querying/reading all triggers.
     * @param id The id of the {@link Trigger}.
     */
    trigger(id: string): Trigger;
    /**
     * Used to read, replace, or delete a specific, existing {@link UserDefinedFunction} by id.
     *
     * Use `.userDefinedFunctions` for creating new user defined functions, or querying/reading all user defined functions.
     * @param id The id of the {@link UserDefinedFunction}.
     */
    userDefinedFunction(id: string): UserDefinedFunction;
    private $sprocs;
    /**
     * Operations for creating new stored procedures, and reading/querying all stored procedures.
     *
     * For reading, replacing, or deleting an existing stored procedure, use `.storedProcedure(id)`.
     */
    readonly storedProcedures: StoredProcedures;
    private $triggers;
    /**
     * Operations for creating new triggers, and reading/querying all triggers.
     *
     * For reading, replacing, or deleting an existing trigger, use `.trigger(id)`.
     */
    readonly triggers: Triggers;
    private $udfs;
    /**
     * Operations for creating new user defined functions, and reading/querying all user defined functions.
     *
     * For reading, replacing, or deleting an existing user defined function, use `.userDefinedFunction(id)`.
     */
    readonly userDefinedFunctions: UserDefinedFunctions;
}

/**
 * Options that can be specified for a requested issued to the Azure Cosmos DB servers.=
 */
declare interface SharedOptions {
    /** Specifies a partition key definition for a particular path in the Azure Cosmos DB database service. */
    partitionKey?: PartitionKey | PartitionKey[];
    /** Enables/disables getting document container quota related stats for document container read requests. */
    sessionToken?: string;
    /** (Advanced use case) Initial headers to start with when sending requests to Cosmos */
    initialHeaders?: CosmosHeaders;
    /**
     * abortSignal to pass to all underlying network requests created by this method call. See https://developer.mozilla.org/en-US/docs/Web/API/AbortController
     * @example Cancel a read request
     * ```typescript
     * const controller = new AbortController()
     * const {result: item} = await items.query('SELECT * from c', { abortSignal: controller.signal});
     * controller.abort()
     * ```
     */
    abortSignal?: AbortSignal;
}

/**
 * Represents a parameter in a Parameterized SQL query, specified in {@link SqlQuerySpec}
 */
export declare interface SqlParameter {
    /** Name of the parameter. (i.e. "@lastName") */
    name: string;
    /** Value of the parameter (this is safe to come from users, assuming they are authorized) */
    value: string | number | boolean;
}

/**
 * Represents a SQL query in the Azure Cosmos DB service.
 *
 * Queries with inputs should be parameterized to protect against SQL injection.
 *
 * @example Parameterized SQL Query
 * ```typescript
 * const query: SqlQuerySpec = {
 *   query: "SELECT * FROM Families f where f.lastName = @lastName",
 *   parameters: [
 *     {name: "@lastName", value: "Wakefield"}
 *   ]
 * };
 * ```
 */
export declare interface SqlQuerySpec {
    /** The text of the SQL query */
    query: string;
    /** The parameters you provide in the query */
    parameters?: SqlParameter[];
}

declare const StatusCode: {
    Ok: 200;
    Created: 201;
    Accepted: 202;
    NoContent: 204;
    NotModified: 304;
    BadRequest: 400;
    Unauthorized: 401;
    Forbidden: 403;
    NotFound: 404;
    MethodNotAllowed: 405;
    RequestTimeout: 408;
    Conflict: 409;
    Gone: 410;
    PreconditionFailed: 412;
    RequestEntityTooLarge: 413;
    TooManyRequests: 429;
    RetryWith: 449;
    InternalServerError: 500;
    ServiceUnavailable: 503;
    OperationPaused: 1200;
    OperationCancelled: number;
};

declare type StatusCode = (typeof StatusCode)[keyof typeof StatusCode];

/**
 * Operations for reading, replacing, deleting, or executing a specific, existing stored procedure by id.
 *
 * For operations to create, upsert, read all, or query Stored Procedures,
 */
export declare class StoredProcedure {
    readonly container: Container;
    readonly id: string;
    private readonly clientContext;
    /**
     * Returns a reference URL to the resource. Used for linking in Permissions.
     */
    readonly url: string;
    /**
     * Creates a new instance of {@link StoredProcedure} linked to the parent {@link Container}.
     * @param container The parent {@link Container}.
     * @param id The id of the given {@link StoredProcedure}.
     * @hidden
     */
    constructor(container: Container, id: string, clientContext: ClientContext);
    /**
     * Read the {@link StoredProcedureDefinition} for the given {@link StoredProcedure}.
     * @param options
     */
    read(options?: RequestOptions): Promise<StoredProcedureResponse>;
    /**
     * Replace the given {@link StoredProcedure} with the specified {@link StoredProcedureDefinition}.
     * @param body The specified {@link StoredProcedureDefinition} to replace the existing definition.
     * @param options
     */
    replace(body: StoredProcedureDefinition, options?: RequestOptions): Promise<StoredProcedureResponse>;
    /**
     * Delete the given {@link StoredProcedure}.
     * @param options
     */
    delete(options?: RequestOptions): Promise<StoredProcedureResponse>;
    /**
     * Execute the given {@link StoredProcedure}.
     * @param params Array of parameters to pass as arguments to the given {@link StoredProcedure}.
     * @param options Additional options, such as the partition key to invoke the {@link StoredProcedure} on.
     */
    execute(params?: any[], options?: RequestOptions): Promise<ResourceResponse<any>>;
    /**
     * Execute the given {@link StoredProcedure}.
     *
     * The specified type, T, is not enforced by the client.
     * Be sure to validate the response from the stored procedure matches the type, T, you provide.
     *
     * @param params Array of parameters to pass as arguments to the given {@link StoredProcedure}.
     * @param options Additional options, such as the partition key to invoke the {@link StoredProcedure} on.
     */
    execute<T>(params?: any[], options?: RequestOptions): Promise<ResourceResponse<T>>;
}

export declare interface StoredProcedureDefinition {
    /**
     * The id of the {@link StoredProcedure}.
     */
    id?: string;
    /**
     * The body of the {@link StoredProcedure}. This is a JavaScript function.
     */
    body?: string | ((...inputs: any[]) => void);
}

export declare class StoredProcedureResponse extends ResourceResponse<StoredProcedureDefinition & Resource> {
    constructor(resource: StoredProcedureDefinition & Resource, headers: CosmosHeaders, statusCode: number, storedProcedure: StoredProcedure);
    /**
     * A reference to the {@link StoredProcedure} which the {@link StoredProcedureDefinition} corresponds to.
     */
    readonly storedProcedure: StoredProcedure;
    /**
     * Alias for storedProcedure.
     *
     * A reference to the {@link StoredProcedure} which the {@link StoredProcedureDefinition} corresponds to.
     */
    readonly sproc: StoredProcedure;
}

/**
 * Operations for creating, upserting, or reading/querying all Stored Procedures.
 *
 * For operations to read, replace, delete, or execute a specific, existing stored procedure by id, see `container.storedProcedure()`.
 */
export declare class StoredProcedures {
    readonly container: Container;
    private readonly clientContext;
    /**
     * @param container The parent {@link Container}.
     * @hidden
     */
    constructor(container: Container, clientContext: ClientContext);
    /**
     * Query all Stored Procedures.
     * @param query Query configuration for the operation. See {@link SqlQuerySpec} for more info on how to configure a query.
     * @param options
     * @example Read all stored procedures to array.
     * ```typescript
     * const querySpec: SqlQuerySpec = {
     *   query: "SELECT * FROM root r WHERE r.id = @sproc",
     *   parameters: [
     *     {name: "@sproc", value: "Todo"}
     *   ]
     * };
     * const {body: sprocList} = await containers.storedProcedures.query(querySpec).toArray();
     * ```
     */
    query(query: SqlQuerySpec, options?: FeedOptions): QueryIterator<any>;
    /**
     * Query all Stored Procedures.
     * @param query Query configuration for the operation. See {@link SqlQuerySpec} for more info on how to configure a query.
     * @param options
     * @example Read all stored procedures to array.
     * ```typescript
     * const querySpec: SqlQuerySpec = {
     *   query: "SELECT * FROM root r WHERE r.id = @sproc",
     *   parameters: [
     *     {name: "@sproc", value: "Todo"}
     *   ]
     * };
     * const {body: sprocList} = await containers.storedProcedures.query(querySpec).toArray();
     * ```
     */
    query<T>(query: SqlQuerySpec, options?: FeedOptions): QueryIterator<T>;
    /**
     * Read all stored procedures.
     * @param options
     * @example Read all stored procedures to array.
     * ```typescript
     * const {body: sprocList} = await containers.storedProcedures.readAll().toArray();
     * ```
     */
    readAll(options?: FeedOptions): QueryIterator<StoredProcedureDefinition & Resource>;
    /**
     * Create a StoredProcedure.
     *
     * Azure Cosmos DB allows stored procedures to be executed in the storage tier,
     * directly against an item container. The script
     * gets executed under ACID transactions on the primary storage partition of the
     * specified container. For additional details,
     * refer to the server-side JavaScript API documentation.
     */
    create(body: StoredProcedureDefinition, options?: RequestOptions): Promise<StoredProcedureResponse>;
    /**
     * Upsert a StoredProcedure.
     *
     * Azure Cosmos DB allows stored procedures to be executed in the storage tier,
     * directly against a document container. The script
     * gets executed under ACID transactions on the primary storage partition of the
     *  specified container. For additional details,
     * refer to the server-side JavaScript API documentation.
     *
     */
    upsert(body: StoredProcedureDefinition, options?: RequestOptions): Promise<StoredProcedureResponse>;
}

/**
 * Represents a time interval.
 *
 * @constructor TimeSpan
 * @param {number} days                 - Number of days.
 * @param {number} hours                - Number of hours.
 * @param {number} minutes              - Number of minutes.
 * @param {number} seconds              - Number of seconds.
 * @param {number} milliseconds         - Number of milliseconds.
 * @ignore
 */
export declare class TimeSpan {
    protected _ticks: number;
    constructor(days: number, hours: number, minutes: number, seconds: number, milliseconds: number);
    /**
     * Returns a new TimeSpan object whose value is the sum of the specified TimeSpan object and this instance.
     * @param {TimeSpan} ts              - The time interval to add.
     * @memberof TimeSpan
     * @instance
     */
    add(ts: TimeSpan): TimeSpan;
    /**
     * Returns a new TimeSpan object whose value is the difference of the specified TimeSpan object and this instance.
     * @param {TimeSpan} ts              - The time interval to subtract.
     * @memberof TimeSpan
     * @instance
     */
    subtract(ts: TimeSpan): TimeSpan;
    /**
     * Compares this instance to a specified object and returns an integer that indicates whether this
     * instance is shorter than, equal to, or longer than the specified object.
     * @param {TimeSpan} value              - The time interval to add.
     * @memberof TimeSpan
     * @instance
     */
    compareTo(value: TimeSpan): 0 | 1 | -1;
    /**
     * Returns a new TimeSpan object whose value is the absolute value of the current TimeSpan object.
     * @memberof TimeSpan
     * @instance
     */
    duration(): TimeSpan;
    /**
     * Returns a value indicating whether this instance is equal to a specified object.
     * @memberof TimeSpan
     * @param {TimeSpan} value              - The time interval to check for equality.
     * @instance
     */
    equals(value: TimeSpan): boolean;
    /**
     * Returns a new TimeSpan object whose value is the negated value of this instance.
     * @memberof TimeSpan
     * @param {TimeSpan} value              - The time interval to check for equality.
     * @instance
     */
    negate(): TimeSpan;
    days(): number;
    hours(): number;
    milliseconds(): number;
    seconds(): number;
    ticks(): number;
    totalDays(): number;
    totalHours(): number;
    totalMilliseconds(): number;
    totalMinutes(): number;
    totalSeconds(): number;
    static fromTicks(value: number): TimeSpan;
    static readonly zero: TimeSpan;
    static readonly maxValue: TimeSpan;
    static readonly minValue: TimeSpan;
    static isTimeSpan(timespan: TimeSpan): number;
    static additionDoesOverflow(a: number, b: number): boolean;
    static subtractionDoesUnderflow(a: number, b: number): boolean;
    static compare(t1: TimeSpan, t2: TimeSpan): 0 | 1 | -1;
    static interval(value: number, scale: number): TimeSpan;
    static fromMilliseconds(value: number): TimeSpan;
    static fromSeconds(value: number): TimeSpan;
    static fromMinutes(value: number): TimeSpan;
    static fromHours(value: number): TimeSpan;
    static fromDays(value: number): TimeSpan;
}

declare type TokenProvider = (requestInfo: RequestInfo) => Promise<string>;

/**
 * Operations to read, replace, or delete a {@link Trigger}.
 *
 * Use `container.triggers` to create, upsert, query, or read all.
 */
export declare class Trigger {
    readonly container: Container;
    readonly id: string;
    private readonly clientContext;
    /**
     * Returns a reference URL to the resource. Used for linking in Permissions.
     */
    readonly url: string;
    /**
     * @hidden
     * @param container The parent {@link Container}.
     * @param id The id of the given {@link Trigger}.
     */
    constructor(container: Container, id: string, clientContext: ClientContext);
    /**
     * Read the {@link TriggerDefinition} for the given {@link Trigger}.
     * @param options
     */
    read(options?: RequestOptions): Promise<TriggerResponse>;
    /**
     * Replace the given {@link Trigger} with the specified {@link TriggerDefinition}.
     * @param body The specified {@link TriggerDefinition} to replace the existing definition with.
     * @param options
     */
    replace(body: TriggerDefinition, options?: RequestOptions): Promise<TriggerResponse>;
    /**
     * Delete the given {@link Trigger}.
     * @param options
     */
    delete(options?: RequestOptions): Promise<TriggerResponse>;
}

export declare interface TriggerDefinition {
    /** The id of the trigger. */
    id?: string;
    /** The body of the trigger, it can also be passed as a stringifed function */
    body: (() => void) | string;
    /** The type of the trigger, should be one of the values of {@link TriggerType}. */
    triggerType: TriggerType;
    /** The trigger operation, should be one of the values of {@link TriggerOperation}. */
    triggerOperation: TriggerOperation;
}

/**
 * Enum for trigger operation values.
 * specifies the operations on which a trigger should be executed.
 */
export declare enum TriggerOperation {
    /** All operations. */
    All = "all",
    /** Create operations only. */
    Create = "create",
    /** Update operations only. */
    Update = "update",
    /** Delete operations only. */
    Delete = "delete",
    /** Replace operations only. */
    Replace = "replace"
}

export declare class TriggerResponse extends ResourceResponse<TriggerDefinition & Resource> {
    constructor(resource: TriggerDefinition & Resource, headers: CosmosHeaders, statusCode: number, trigger: Trigger);
    /** A reference to the {@link Trigger} corresponding to the returned {@link TriggerDefinition}. */
    readonly trigger: Trigger;
}

/**
 * Enum for trigger type values.
 * Specifies the type of the trigger.
 */
export declare enum TriggerType {
    /** Trigger should be executed before the associated operation(s). */
    Pre = "pre",
    /** Trigger should be executed after the associated operation(s). */
    Post = "post"
}

/**
 * Operations to create, upsert, query, and read all triggers.
 *
 * Use `container.triggers` to read, replace, or delete a {@link Trigger}.
 */
export declare class Triggers {
    readonly container: Container;
    private readonly clientContext;
    /**
     * @hidden
     * @param container The parent {@link Container}.
     */
    constructor(container: Container, clientContext: ClientContext);
    /**
     * Query all Triggers.
     * @param query Query configuration for the operation. See {@link SqlQuerySpec} for more info on how to configure a query.
     * @param options
     */
    query(query: SqlQuerySpec, options?: FeedOptions): QueryIterator<any>;
    /**
     * Query all Triggers.
     * @param query Query configuration for the operation. See {@link SqlQuerySpec} for more info on how to configure a query.
     * @param options
     */
    query<T>(query: SqlQuerySpec, options?: FeedOptions): QueryIterator<T>;
    /**
     * Read all Triggers.
     * @param options
     * @example Read all trigger to array.
     * ```typescript
     * const {body: triggerList} = await container.triggers.readAll().toArray();
     * ```
     */
    readAll(options?: FeedOptions): QueryIterator<TriggerDefinition & Resource>;
    /**
     * Create a trigger.
     *
     * Azure Cosmos DB supports pre and post triggers defined in JavaScript to be executed
     * on creates, updates and deletes.
     *
     * For additional details, refer to the server-side JavaScript API documentation.
     * @param body
     * @param options
     */
    create(body: TriggerDefinition, options?: RequestOptions): Promise<TriggerResponse>;
    /**
     * Upsert a trigger.
     *
     * Azure Cosmos DB supports pre and post triggers defined in JavaScript to be
     * executed on creates, updates and deletes.
     *
     * For additional details, refer to the server-side JavaScript API documentation.
     * @param body
     * @param options
     */
    upsert(body: TriggerDefinition, options?: RequestOptions): Promise<TriggerResponse>;
}

/** Interface for a single unique key passed as part of UniqueKeyPolicy */
export declare interface UniqueKey {
    paths: string[];
}

/** Interface for setting unique keys on container creation */
export declare interface UniqueKeyPolicy {
    uniqueKeys: UniqueKey[];
}

/**
 * Used to read, replace, and delete Users.
 *
 * Additionally, you can access the permissions for a given user via `user.permission` and `user.permissions`.
 *
 * @see {@link Users} to create, upsert, query, or read all.
 */
export declare class User {
    readonly database: Database;
    readonly id: string;
    private readonly clientContext;
    /**
     * Operations for creating, upserting, querying, or reading all operations.
     *
     * See `client.permission(id)` to read, replace, or delete a specific Permission by id.
     */
    readonly permissions: Permissions;
    /**
     * Returns a reference URL to the resource. Used for linking in Permissions.
     */
    readonly url: string;
    /**
     * @hidden
     * @param database The parent {@link Database}.
     * @param id
     */
    constructor(database: Database, id: string, clientContext: ClientContext);
    /**
     * Operations to read, replace, or delete a specific Permission by id.
     *
     * See `client.permissions` for creating, upserting, querying, or reading all operations.
     * @param id
     */
    permission(id: string): Permission;
    /**
     * Read the {@link UserDefinition} for the given {@link User}.
     * @param options
     */
    read(options?: RequestOptions): Promise<UserResponse>;
    /**
     * Replace the given {@link User}'s definition with the specified {@link UserDefinition}.
     * @param body The specified {@link UserDefinition} to replace the definition.
     * @param options
     */
    replace(body: UserDefinition, options?: RequestOptions): Promise<UserResponse>;
    /**
     * Delete the given {@link User}.
     * @param options
     */
    delete(options?: RequestOptions): Promise<UserResponse>;
}

/**
 * Used to read, replace, or delete a specified User Definied Function by id.
 *
 * @see {@link UserDefinedFunction} to create, upsert, query, read all User Defined Functions.
 */
export declare class UserDefinedFunction {
    readonly container: Container;
    readonly id: string;
    private readonly clientContext;
    /**
     * Returns a reference URL to the resource. Used for linking in Permissions.
     */
    readonly url: string;
    /**
     * @hidden
     * @param container The parent {@link Container}.
     * @param id The id of the given {@link UserDefinedFunction}.
     */
    constructor(container: Container, id: string, clientContext: ClientContext);
    /**
     * Read the {@link UserDefinedFunctionDefinition} for the given {@link UserDefinedFunction}.
     * @param options
     */
    read(options?: RequestOptions): Promise<UserDefinedFunctionResponse>;
    /**
     * Replace the given {@link UserDefinedFunction} with the specified {@link UserDefinedFunctionDefinition}.
     * @param body The specified {@link UserDefinedFunctionDefinition}.
     * @param options
     */
    replace(body: UserDefinedFunctionDefinition, options?: RequestOptions): Promise<UserDefinedFunctionResponse>;
    /**
     * Delete the given {@link UserDefined}.
     * @param options
     */
    delete(options?: RequestOptions): Promise<UserDefinedFunctionResponse>;
}

export declare interface UserDefinedFunctionDefinition {
    /** The id of the {@link UserDefinedFunction} */
    id?: string;
    /** The body of the user defined function, it can also be passed as a stringifed function */
    body?: string | (() => void);
}

export declare class UserDefinedFunctionResponse extends ResourceResponse<UserDefinedFunctionDefinition & Resource> {
    constructor(resource: UserDefinedFunctionDefinition & Resource, headers: CosmosHeaders, statusCode: number, udf: UserDefinedFunction);
    /** A reference to the {@link UserDefinedFunction} corresponding to the returned {@link UserDefinedFunctionDefinition}. */
    readonly userDefinedFunction: UserDefinedFunction;
    /**
     * Alias for `userDefinedFunction(id).
     *
     * A reference to the {@link UserDefinedFunction} corresponding to the returned {@link UserDefinedFunctionDefinition}.
     */
    readonly udf: UserDefinedFunction;
}

/**
 * Enum for udf type values.
 * Specifies the types of user defined functions.
 */
export declare enum UserDefinedFunctionType {
    /** The User Defined Function is written in JavaScript. This is currently the only option. */
    Javascript = "Javascript"
}

/**
 * Used to create, upsert, query, or read all User Defined Functions.
 *
 * @see {@link UserDefinedFunction} to read, replace, or delete a given User Defined Function by id.
 */
export declare class UserDefinedFunctions {
    readonly container: Container;
    private readonly clientContext;
    /**
     * @hidden
     * @param container The parent {@link Container}.
     */
    constructor(container: Container, clientContext: ClientContext);
    /**
     * Query all User Defined Functions.
     * @param query Query configuration for the operation. See {@link SqlQuerySpec} for more info on how to configure a query.
     * @param options
     */
    query(query: SqlQuerySpec, options?: FeedOptions): QueryIterator<any>;
    /**
     * Query all User Defined Functions.
     * @param query Query configuration for the operation. See {@link SqlQuerySpec} for more info on how to configure a query.
     * @param options
     */
    query<T>(query: SqlQuerySpec, options?: FeedOptions): QueryIterator<T>;
    /**
     * Read all User Defined Functions.
     * @param options
     * @example Read all User Defined Functions to array.
     * ```typescript
     * const {body: udfList} = await container.userDefinedFunctions.readAll().toArray();
     * ```
     */
    readAll(options?: FeedOptions): QueryIterator<UserDefinedFunctionDefinition & Resource>;
    /**
     * Create a UserDefinedFunction.
     *
     * Azure Cosmos DB supports JavaScript UDFs which can be used inside queries, stored procedures and triggers.
     *
     * For additional details, refer to the server-side JavaScript API documentation.
     *
     */
    create(body: UserDefinedFunctionDefinition, options?: RequestOptions): Promise<UserDefinedFunctionResponse>;
    /**
     * Upsert a UserDefinedFunction.
     *
     * Azure Cosmos DB supports JavaScript UDFs which can be used inside queries, stored procedures and triggers.
     *
     * For additional details, refer to the server-side JavaScript API documentation.
     *
     */
    upsert(body: UserDefinedFunctionDefinition, options?: RequestOptions): Promise<UserDefinedFunctionResponse>;
}

export declare interface UserDefinition {
    /** The id of the user. */
    id?: string;
}

export declare class UserResponse extends ResourceResponse<UserDefinition & Resource> {
    constructor(resource: UserDefinition & Resource, headers: CosmosHeaders, statusCode: number, user: User);
    /** A reference to the {@link User} corresponding to the returned {@link UserDefinition}. */
    readonly user: User;
}

/**
 * Used to create, upsert, query, and read all users.
 *
 * @see {@link User} to read, replace, or delete a specific User by id.
 */
export declare class Users {
    readonly database: Database;
    private readonly clientContext;
    /**
     * @hidden
     * @param database The parent {@link Database}.
     */
    constructor(database: Database, clientContext: ClientContext);
    /**
     * Query all users.
     * @param query Query configuration for the operation. See {@link SqlQuerySpec} for more info on how to configure a query.
     * @param options
     */
    query(query: SqlQuerySpec, options?: FeedOptions): QueryIterator<any>;
    /**
     * Query all users.
     * @param query Query configuration for the operation. See {@link SqlQuerySpec} for more info on how to configure a query.
     * @param options
     */
    query<T>(query: SqlQuerySpec, options?: FeedOptions): QueryIterator<T>;
    /**
     * Read all users.
     * @param options
     * @example Read all users to array.
     * ```typescript
     * const {body: usersList} = await database.users.readAll().toArray();
     * ```
     */
    readAll(options?: FeedOptions): QueryIterator<UserDefinition & Resource>;
    /**
     * Create a database user with the specified {@link UserDefinition}.
     * @param body The specified {@link UserDefinition}.
     * @param options
     */
    create(body: UserDefinition, options?: RequestOptions): Promise<UserResponse>;
    /**
     * Upsert a database user with a specified {@link UserDefinition}.
     * @param body The specified {@link UserDefinition}.
     * @param options
     */
    upsert(body: UserDefinition, options?: RequestOptions): Promise<UserResponse>;
}

export declare function extractPartitionKey(document: any, partitionKeyDefinition: PartitionKeyDefinition): PartitionKey[];

/** The default function for setting header token using the masterKey */
export declare function setAuthorizationTokenHeaderUsingMasterKey(verb: HTTPMethod, resourceId: string, resourceType: ResourceType, headers: CosmosHeaders, masterKey: string): void;
